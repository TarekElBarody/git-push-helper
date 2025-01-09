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
push "<commit-message>" [branch-name] [-p]
```

### Parameters
- `<commit-message>`: The commit message to use.
- `[branch-name]`: (Optional) The branch to push to. If not provided, the script will detect the current branch automatically.
- `-p`: (Optional) Increment the patch version in `package.json` and `package-lock.json` before committing.

### Example:

1. **Push without version bump**:
   ```bash
   push "Fix login bug"
   ```
   This will:
   - Commit your changes with the message "Fix login bug".
   - Push the changes to the detected branch.

2. **Push with version bump**:
   ```bash
   push "Add new feature" -p
   ```
   This will:
   - Increment the patch version (e.g., `1.0.0` → `1.0.1`).
   - Commit the version bump.
   - Commit your changes with the message "Add new feature".
   - Push the changes to the detected branch.

3. **Specify a branch**:
   ```bash
   push "Update styles" dev
   ```
   This will:
   - Commit your changes with the message "Update styles".
   - Push the changes to the `dev` branch.

4. **Specify a branch with version bump**:
   ```bash
   push "Enhance API" dev -p
   ```
   This will:
   - Increment the patch version.
   - Commit the version bump.
   - Commit your changes with the message "Enhance API".
   - Push the changes to the `dev` branch.

### Error Handling
If any error occurs during the Git operations, the tool will provide an error message and exit.

## Features

- Automates the `git add`, `git commit`, and `git push` workflow.
- Auto-detects the current branch if no branch is specified.
- Supports optional version bumping with the `-p` flag.
- Simple and intuitive CLI for quick usage.
- Supports global installation for seamless access from anywhere.

## GitHub Repository

Find the source code and contribute to the project on GitHub:
[git-push-helper](https://github.com/TarekElBarody/git-push-helper)

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Tarek El Barody

