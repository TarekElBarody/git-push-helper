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
push "<title>" ["<message>"] [-b <branch>] [-p | -m]
```

### Parameters
- `<title>`: The commit title (first line of the commit).
- `<message>`: (Optional) A longer description, added to the commit below the title.
- `-b <branch>`: (Optional) The branch to push to. If not given, the current branch is used.
  - If the branch exists locally, it is switched to.
  - If it exists only on `origin`, it is checked out and set to track `origin/<branch>`.
  - If it does not exist anywhere, it is created.
- `-p`: (Optional) Increment the patch version in `package.json` and `package-lock.json` before committing (e.g., `1.0.1` → `1.0.2`).
- `-m`: (Optional) Increment the minor version in `package.json` and `package-lock.json` before committing (e.g., `1.1.0` → `1.2.0`).
- `-h`, `--help`: Show the usage.

Options can be written in any order.

### Examples

1. **Push with a title only**:
   ```bash
   push "Fix login bug"
   ```
   Commits all changes with the title "Fix login bug" and pushes to the current branch.

2. **Push with a title and a message**:
   ```bash
   push "Fix login bug" "The token was not refreshed after the session expired."
   ```
   The commit gets "Fix login bug" as its title and the second text as its description.

3. **Push to another branch**:
   ```bash
   push "Update styles" -b dev
   ```
   Switches to `dev` (creating it if needed), commits, and pushes to `origin/dev`.

4. **Push with a patch version bump**:
   ```bash
   push "Add new feature" -p
   ```
   - Increments the patch version (e.g., `1.0.1` → `1.0.2`) in its own commit: `chore(release): bump version to 1.0.2`.
   - Commits your changes with the title "Add new feature".
   - Pushes both commits.

5. **Everything together**:
   ```bash
   push "Add reports page" "New monthly and yearly reports." -b dev -m
   ```

### Upgrading from 1.x
In 1.x the branch was the second argument (`push "msg" dev`). From 2.0 the second argument is the commit message, and the branch is given with `-b`:

```bash
push "msg" -b dev
```

### Behaviour notes
- Works from any folder inside the repository. All changes in the repository are committed, and the nearest `package.json` (from the current folder up to the repo root) is used for version bumps.
- If there is nothing new to commit, existing commits are still pushed.
- The branch is pushed with `-u`, so it tracks `origin/<branch>` afterwards.
- Pre-release versions follow `npm version` rules (e.g., `-p` on `1.0.0-beta.1` gives `1.0.0`).
- Quotes, `$`, backticks and `%` in the title or message are kept as typed.

### Error Handling
If any error occurs during the Git operations, the tool will provide an error message and exit.

## Features

- Automates the `git add`, `git commit`, and `git push` workflow.
- Separate commit title and message.
- Auto-detects the current branch if no branch is specified.
- Switches to, checks out from `origin`, or creates the branch given with `-b`.
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

Made with ❤️ by Tarek
