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
push "<commit-message>" [branch-name] [-p] [-m]
```

### Parameters
- `<commit-message>`: The commit message to use.
- `[branch-name]`: (Optional) The branch to push to. If not provided, the script will detect the current branch automatically. If the specified branch does not exist, it will be created and switched to.
- `-p`: (Optional) Increment the patch version in `package.json` and `package-lock.json` before committing (e.g., `1.0.1` → `1.0.2`).
- `-m`: (Optional) Increment the minor version in `package.json` and `package-lock.json` before committing (e.g., `1.1.0` → `1.2.0`).

### Example:

1. **Push without version bump**:
   ```bash
   push "Fix login bug"
   ```
   This will:
   - Commit your changes with the message "Fix login bug".
   - Push the changes to the detected branch.

2. **Push with patch version bump**:
   ```bash
   push "Add new feature" -p
   ```
   This will:
   - Increment the patch version (e.g., `1.0.1` → `1.0.2`).
   - Commit the version bump.
   - Commit your changes with the message "Add new feature".
   - Push the changes to the detected branch.

3. **Push with minor version bump**:
   ```bash
   push "Add major feature" -m
   ```
   This will:
   - Increment the minor version (e.g., `1.1.0` → `1.2.0`).
   - Commit the version bump.
   - Commit your changes with the message "Add major feature".
   - Push the changes to the detected branch.

4. **Specify a branch (branch exists)**:
   ```bash
   push "Update styles" dev
   ```
   This will:
   - Commit your changes with the message "Update styles".
   - Push the changes to the `dev` branch.

5. **Specify a branch (branch does not exist)**:
   ```bash
   push "Enhance API" new-feature
   ```
   This will:
   - Create the `new-feature` branch if it doesn't exist.
   - Switch to the `new-feature` branch.
   - Commit your changes with the message "Enhance API".
   - Push the changes to the `new-feature` branch.

### Branch Handling
- If the specified branch does not exist, the script will create it and switch to it.
- If the branch already exists, the script will switch to it without attempting to recreate it.

### Error Handling
If any error occurs during the Git operations, the tool will provide an error message and exit.

## Features

- Automates the `git add`, `git commit`, and `git push` workflow.
- Auto-detects the current branch if no branch is specified.
- Creates and switches to a new branch if the specified branch does not exist.
- Supports optional version bumping:
  - `-p`: Increment patch version (e.g., `1.0.1` → `1.0.2`).
  - `-m`: Increment minor version (e.g., `1.1.0` → `1.2.0`).
- Simple and intuitive CLI for quick usage.
- Supports global installation for seamless access from anywhere.

## GitHub Repository

Find the source code and contribute to the project on GitHub:
[git-push-helper](https://github.com/TarekElBarody/git-push-helper)

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Tarek El Barody

