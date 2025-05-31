# Local Key Vault CLI (mkv)

A simple command-line interface (CLI) tool to securely store and manage key-value secrets locally on your machine. Secrets are stored in a `secrets.json` file in the project directory.

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dangvu0502/mkv.git
    cd local-key-vault-cli
    ```

2.  **Install dependencies:**
    This command installs the necessary dependencies, like `commander`, as defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Ensure the script is executable (for local execution):**
    This step allows you to run the script directly from within the project folder (e.g., `./index.js list`). It might have been set previously.
    ```bash
    chmod +x index.js
    ```
    You can always run commands using `node index.js <command>` if you don't make it executable or if you prefer.

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

*   **Import secrets from a JSON file:**
    Imports key-value pairs from a specified JSON file. The file must contain a single JSON object. Existing keys will be overwritten.
    ```bash
    ./index.js import <filepath>
    ```
    Example:
    ```bash
    ./index.js import mysecrets.json
    ```
    Contents of `mysecrets.json` should be like:
    ```json
    {
      "newApiKey": "anotherS3cr3t",
      "dbUser": "user123"
    }
    ```

*   **Export all secrets to a JSON file:**
    Exports all stored secrets to a specified JSON file.
    ```bash
    ./index.js export <filepath>
    ```
    Example:
    ```bash
    ./index.js export backup_secrets.json
    ```

### Secrets File

Secrets are stored in a JSON file named `secrets.json` in the same directory as the `index.js` script. You can inspect this file directly, but be careful not to commit it to version control if it contains sensitive information.

## License

ISC
