# Local Key Vault CLI (mkv)

A simple command-line interface (CLI) tool to securely store and manage key-value secrets locally on your machine. Secrets are stored in a `secrets.json` file in the project directory.

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)

## Setup

1.  **Navigate to the project directory:**
    ```bash
    cd /path/to/key-vault
    ```

2.  **Install dependencies** (if you haven't already):
    The primary dependency is `commander`, which should have been installed when we set up the project. If you're setting this up fresh and have the `package.json`:
    ```bash
    npm install
    ```

3.  **Make the CLI script executable:**
    ```bash
    chmod +x index.js
    ```
    You can also run the commands using `node index.js <command>` if you prefer not to make it executable.

## Making the CLI Globally Accessible (Optional)

To use the `mkv` command from any directory in your terminal, you can link it using npm:

1.  **Ensure `bin` field in `package.json`:**
    Your `package.json` should have a `bin` field specifying the command name and the entry script:
    ```json
    {
      "name": "local-key-vault-cli",
      "version": "1.0.0",
      // ... other fields
      "bin": {
        "mkv": "./index.js"
      },
      // ... rest of the file
    }
    ```
    This was added in a previous step.

2.  **Run `npm link`:**
    In your project directory, run:
    ```bash
    npm link
    ```

After this, you can use `mkv` directly:
```bash
mkv list
mkv set anotherKey "another value"
```

To remove the global link later, navigate back to your project directory and run:
```bash
npm unlink
```

---

## Usage

The CLI script is `index.js`. You can run it as `./index.js` (if executable and in the current directory) or `node index.js`.
The default name for the command is `mkv` (you might see this in help messages if you link it globally, but for local execution, use `./index.js`).

### Commands

*   **Set a secret:**
    ```bash
    ./index.js set <key> <value>
    ```
    Example:
    ```bash
    ./index.js set myApiKey S3cr3tV@lu3
    ```

*   **Get a secret:**
    ```bash
    ./index.js get <key>
    ```
    Example:
    ```bash
    ./index.js get myApiKey
    ```

*   **Delete a secret:**
    ```bash
    ./index.js delete <key>
    ```
    Example:
    ```bash
    ./index.js delete myApiKey
    ```

*   **List all secret keys:**
    By default, values are partially masked.
    ```bash
    ./index.js list
    ```
    To show full values:
    ```bash
    ./index.js list -s
    # OR
    ./index.js list --show-values
    ```

*   **Show help:**
    ```bash
    ./index.js --help
    # OR for a specific command
    ./index.js set --help
    ```

### Secrets File

Secrets are stored in a JSON file named `local-secrets.json` in the same directory as the `index.js` script. You can inspect this file directly, but be careful not to commit it to version control if it contains sensitive information.

## License

ISC
