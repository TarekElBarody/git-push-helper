# git-push-helper

A simple and efficient command-line tool to simplify Git commit and push workflows.

## Installation

### Install Globally
To install `git-push-helper` globally, use:

```bash
npm install -g git-push-helper
```

## Usage

After installing, you can use the `push` command globally to commit and push your changes in a single step.

```bash
push "<commit-message>" <branch-name>
```

If no branch name is provided, `git-push-helper` will automatically detect the current branch.

### Example:

```bash
push "Fix login bug" main
```

This will execute the following Git commands under the hood:

```bash
git add .
git commit -m "Fix login bug"
git push origin main
```

Or, if no branch is specified:

```bash
push "Fix login bug"
```

This will detect the current branch and push the changes to it.

### Error Handling
If any error occurs during the Git operations, the tool will provide an error message and exit.

## Features

- Automates the `git add`, `git commit`, and `git push` workflow.
- Auto-detects the current branch if no branch is specified.
- Simple and intuitive CLI for quick usage.
- Supports global installation for seamless access from anywhere.

## GitHub Repository

Find the source code and contribute to the project on GitHub:
[git-push-helper](https://github.com/TarekElBarody/git-push-helper)

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Tarek El Barody

