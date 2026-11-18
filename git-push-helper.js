#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const USAGE = `Usage: push "<title>" ["<message>"] [-b <branch>] [-p | -m]

  <title>        Commit title (first line of the commit).
  <message>      Optional longer description, added below the title.
  -b <branch>    Branch to push to. Defaults to the current branch.
                 Switched to if it exists (locally or on origin), created if not.
  -p             Bump the patch version first (1.0.1 -> 1.0.2).
  -m             Bump the minor version first (1.1.0 -> 1.2.0).
  -h, --help     Show this help.`;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

// ---------- argument parsing ----------

function parseArgs(argv) {
  const opts = { positionals: [], branch: null, patch: false, minor: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      console.log(USAGE);
      process.exit(0);
    } else if (arg === '-p') {
      opts.patch = true;
    } else if (arg === '-m') {
      opts.minor = true;
    } else if (arg === '-b' || arg === '--branch') {
      const value = argv[++i];
      if (!value || value.startsWith('-')) fail(`${arg} needs a branch name, e.g. -b dev`);
      opts.branch = value;
    } else if (arg.startsWith('-') && arg.length > 1) {
      fail(`unknown option "${arg}"\n\n${USAGE}`);
    } else {
      opts.positionals.push(arg);
    }
  }

  if (opts.positionals.length === 0) fail(`a commit title is required\n\n${USAGE}`);
  if (opts.positionals.length > 2) {
    fail(`too many arguments. Put the title and the message in quotes, and give the branch with -b.\n\n${USAGE}`);
  }
  if (opts.patch && opts.minor) fail('use either -p or -m, not both');

  opts.title = opts.positionals[0];
  opts.message = opts.positionals[1] || '';
  if (!opts.title.trim()) fail('the commit title is empty');
  return opts;
}

// ---------- git helpers (no shell, so quotes/$/` in text are safe) ----------

let repoRoot = process.cwd();

function git(args, { quiet = false } = {}) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function gitShow(args) {
  execFileSync('git', args, { cwd: repoRoot, stdio: 'inherit' });
}

function gitOk(args) {
  try {
    git(args, { quiet: true });
    return true;
  } catch {
    return false;
  }
}

// ---------- branch handling ----------

function checkoutBranch(branch, current) {
  if (branch === current) {
    console.log(`On branch "${branch}".`);
    return;
  }

  if (gitOk(['show-ref', '--verify', '--quiet', `refs/heads/${branch}`])) {
    console.log(`Switching to existing branch "${branch}"...`);
    gitShow(['checkout', branch]);
    return;
  }

  let remoteHeads;
  try {
    remoteHeads = git(['ls-remote', '--heads', 'origin', `refs/heads/${branch}`], { quiet: true });
  } catch (error) {
    fail(`could not reach "origin" to check for branch "${branch}": ${error.message}`);
  }

  if (remoteHeads) {
    console.log(`Branch "${branch}" exists on origin. Checking it out...`);
    gitShow(['fetch', 'origin', branch]);
    gitShow(['checkout', '-b', branch, '--track', `origin/${branch}`]);
  } else {
    console.log(`Branch "${branch}" does not exist. Creating it...`);
    gitShow(['checkout', '-b', branch]);
  }
}

// ---------- version bump ----------

function findPackageJson() {
  let dir = path.resolve(process.cwd());
  const root = path.resolve(repoRoot);
  for (;;) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) return candidate;
    if (dir === root || path.dirname(dir) === dir) return null;
    dir = path.dirname(dir);
  }
}

function nextVersion(current, kind) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.exec(current || '');
  if (!match) fail(`"${current}" in package.json is not a valid version (expected x.y.z)`);

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  const isPrerelease = current.includes('-');

  // Same rules as `npm version`: a pre-release is released as its own version first.
  if (kind === 'patch') {
    return isPrerelease ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch + 1}`;
  }
  return isPrerelease && patch === 0 ? `${major}.${minor}.0` : `${major}.${minor + 1}.0`;
}

function readJson(file) {
  const text = fs.readFileSync(file, 'utf8');
  const indent = (/\n([ \t]+)"/.exec(text) || [, '  '])[1];
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  return { data: JSON.parse(text), indent, eol };
}

function writeJson(file, { data, indent, eol }) {
  const text = JSON.stringify(data, null, indent).replace(/\n/g, eol) + eol;
  fs.writeFileSync(file, text);
}

function bumpVersion(kind) {
  const packageJsonPath = findPackageJson();
  if (!packageJsonPath) fail('package.json not found (looked from this folder up to the repo root).');

  const pkg = readJson(packageJsonPath);
  const currentVersion = pkg.data.version;
  const newVersion = nextVersion(currentVersion, kind);

  console.log(`Bumping version from ${currentVersion} to ${newVersion}...`);
  pkg.data.version = newVersion;
  writeJson(packageJsonPath, pkg);

  const files = [packageJsonPath];
  const lockPath = path.join(path.dirname(packageJsonPath), 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = readJson(lockPath);
    lock.data.version = newVersion;
    if (lock.data.packages && lock.data.packages['']) {
      lock.data.packages[''].version = newVersion; // lockfileVersion 2 and 3
    }
    writeJson(lockPath, lock);
    files.push(lockPath);
  }

  // Commit only the version files; anything else already staged stays staged.
  gitShow(['add', '--', ...files]);
  gitShow(['commit', '-m', `chore(release): bump version to ${newVersion}`, '--', ...files]);
}

// ---------- main ----------

function main() {
  const opts = parseArgs(process.argv.slice(2));

  try {
    repoRoot = git(['rev-parse', '--show-toplevel'], { quiet: true });
  } catch {
    fail('this folder is not inside a git repository.');
  }

  const current = git(['rev-parse', '--abbrev-ref', 'HEAD'], { quiet: true });
  if (!opts.branch && current === 'HEAD') {
    fail('you are not on a branch (detached HEAD). Give one with -b <branch>.');
  }
  const branch = opts.branch || current;
  if (!opts.branch) console.log(`Detected current branch: ${branch}`);

  if (!gitOk(['check-ref-format', '--branch', branch])) fail(`"${branch}" is not a valid branch name.`);

  checkoutBranch(branch, current);

  if (opts.patch) bumpVersion('patch');
  if (opts.minor) bumpVersion('minor');

  console.log('Adding changes...');
  gitShow(['add', '-A']);

  if (gitOk(['diff', '--cached', '--quiet'])) {
    console.log('Nothing new to commit. Pushing existing commits...');
  } else {
    console.log(`Committing: "${opts.title}"`);
    const commitArgs = ['commit', '-m', opts.title];
    if (opts.message) commitArgs.push('-m', opts.message);
    gitShow(commitArgs);
  }

  console.log(`Pushing to origin/${branch}...`);
  gitShow(['push', '-u', 'origin', branch]);

  console.log('Changes pushed successfully!');
}

try {
  main();
} catch (error) {
  console.error('An error occurred while pushing changes:', error.message);
  process.exit(1);
}
