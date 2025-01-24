#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: push "<commit-message>" [branch] [-p] [-m]');
  process.exit(1);
}

const commitMessage = args[0];
let branchName = args[1];
const patchFlag = args.includes('-p');
const minorFlag = args.includes('-m');

if (!branchName || branchName === '-p' || branchName === '-m') {
  try {
    // Detect the current branch
    branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    console.log(`Detected current branch: ${branchName}`);
  } catch (error) {
    console.error('Error detecting current branch:', error.message);
    process.exit(1);
  }
}

try {
  // Check if the branch exists
  const branchExists = execSync(`git show-ref --verify --quiet refs/heads/${branchName}`)
    .toString()
    .trim();

  if (!branchExists) {
    console.log(`Branch "${branchName}" does not exist. Creating and switching to it...`);
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  } else {
    console.log(`Branch "${branchName}" exists. Switching to it...`);
    execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
  }

  // Version bump logic
  if (patchFlag || minorFlag) {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');

    if (!fs.existsSync(packageJsonPath)) {
      console.error('Error: package.json not found.');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    let newVersion;
    if (minorFlag) {
      newVersion = `${major}.${minor + 1}.0`; // Bump minor version and reset patch
    } else if (patchFlag) {
      newVersion = `${major}.${minor}.${patch + 1}`; // Bump patch version
    }

    console.log(`Bumping version from ${currentVersion} to ${newVersion}...`);
    packageJson.version = newVersion;

    // Update package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update package-lock.json if it exists
    if (fs.existsSync(packageLockPath)) {
      const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
      packageLock.version = newVersion;
      fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
    }

    // Commit the version bump
    execSync(`git add package.json package-lock.json`, { stdio: 'inherit' });
    execSync(`git commit -m "chore(release): bump version to ${newVersion}"`, { stdio: 'inherit' });
  }

  console.log('Adding changes...');
  execSync('git add .', { stdio: 'inherit' });

  console.log(`Committing with message: "${commitMessage}"`);
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  console.log(`Pushing to branch: "${branchName}"`);
  execSync(`git push origin ${branchName}`, { stdio: 'inherit' });

  console.log('Changes pushed successfully!');
} catch (error) {
  console.error('An error occurred while pushing changes:', error.message);
  process.exit(1);
}