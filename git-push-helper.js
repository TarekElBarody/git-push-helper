#!/usr/bin/env node

const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: push "<commit-message>" [branch]');
  process.exit(1);
}

const commitMessage = args[0];
let branchName = args[1];

if (!branchName) {
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
