#!/usr/bin/env node

const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: push "<commit-message>" <branch>');
  process.exit(1);
}

const commitMessage = args[0];
const branchName = args[1];

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
