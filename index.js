#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';

const program = new Command();

// Define the path for the secrets file
const secretsFilePath = path.join(import.meta.dirname, 'secrets.json');

// Helper function to load secrets
async function loadSecrets() {
  try {
    const data = await fs.readFile(secretsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is invalid JSON, return an empty object
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Error loading secrets:', error.message);
    return {}; // Or throw error if you prefer stricter handling
  }
}

// Helper function to save secrets
async function saveSecrets(secrets) {
  try {
    await fs.writeFile(secretsFilePath, JSON.stringify(secrets, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving secrets:', error.message);
  }
}

program
  .name('mkv')
  .description('CLI to manage local secrets')
  .version('1.0.0');

program
  .command('set <key> <value>')
  .description('Set a secret')
  .action(async (key, value) => {
    const secrets = await loadSecrets();
    secrets[key] = value;
    await saveSecrets(secrets);
    console.log(`Secret '${key}' set.`);
  });

program
  .command('get <key>')
  .description('Get a secret')
  .action(async (key) => {
    const secrets = await loadSecrets();
    if (secrets[key] !== undefined) {
      console.log(secrets[key]);
    } else {
      console.log(`Secret '${key}' not found.`);
    }
  });

program
  .command('delete <key>')
  .description('Delete a secret')
  .action(async (key) => {
    const secrets = await loadSecrets();
    if (secrets[key] !== undefined) {
      delete secrets[key];
      await saveSecrets(secrets);
      console.log(`Secret '${key}' deleted.`);
    } else {
      console.log(`Secret '${key}' not found.`);
    }
  });

program
  .command('list')
  .description('List all secret keys and their values (partially masked)')
  .option('-s, --show-values', 'Show actual values instead of masking them')
  .action(async (options) => {
    const secrets = await loadSecrets();
    const keys = Object.keys(secrets);
    if (keys.length > 0) {
      console.log('Stored Secrets:');
      console.log('-------------------------------------');
      // Determine the maximum key length for padding, ensuring 'KEY' header fits
      const keyHeader = 'KEY';
      const valueHeader = 'VALUE';
      let maxKeyLength = keyHeader.length;
      keys.forEach(key => {
        if (key.length > maxKeyLength) {
          maxKeyLength = key.length;
        }
      });
      const keyColumnWidth = maxKeyLength + 3; // Add some padding

      console.log(`${keyHeader.padEnd(keyColumnWidth)} | ${valueHeader}`);
      console.log(`${'-'.repeat(keyColumnWidth)}-|-${'-'.repeat(valueHeader.length + 20)}`); // Adjust line to match header

      keys.forEach(key => {
        let valueToDisplay = secrets[key];
        let originalValueType = typeof valueToDisplay;

        if (!options.showValues) {
          if (originalValueType === 'string') {
            if (valueToDisplay.length > 7) {
              valueToDisplay = `${valueToDisplay.substring(0, 3)}...${valueToDisplay.substring(valueToDisplay.length - 3)}`;
            } else if (valueToDisplay.length > 0) {
              valueToDisplay = '***';
            } else {
              valueToDisplay = '(empty string)';
            }
          } else if (valueToDisplay === null || valueToDisplay === undefined) {
            valueToDisplay = `(${String(valueToDisplay)})`;
          } else { // For numbers, booleans, etc.
            valueToDisplay = '***';
          }
        } else {
          // If showing values, ensure they are strings for display
          if (valueToDisplay === null || valueToDisplay === undefined) {
            valueToDisplay = `(${String(valueToDisplay)})`;
          } else {
            valueToDisplay = String(valueToDisplay);
          }
        }
        console.log(`${key.padEnd(keyColumnWidth)} | ${valueToDisplay}`);
      });
      console.log(`${'-'.repeat(keyColumnWidth)}-|-${'-'.repeat(valueHeader.length + 20)}`);
      console.log(`Total secrets: ${keys.length}`);
      if (!options.showValues) {
        console.log("Hint: Run with the '--show-values' or '-s' flag to display full secret values.");
      }
    } else {
      console.log('No secrets stored yet.');
    }
  });


program
  .command('import <filepath>')
  .description('Import secrets from a JSON file. Existing keys will be overwritten.')
  .action(async (filepath) => {
    const existingSecrets = await loadSecrets();
    let newSecretsFromFile = {};

    try {
      const fileContent = await fs.readFile(filepath, 'utf-8');
      newSecretsFromFile = JSON.parse(fileContent);

      if (typeof newSecretsFromFile !== 'object' || newSecretsFromFile === null || Array.isArray(newSecretsFromFile)) {
        console.error('Error: The input file must contain a valid JSON object (key-value pairs).');
        // Ensure program exits or indicates failure clearly if needed, e.g., process.exit(1)
        return;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`Error: File not found at ''`);
      } else if (error instanceof SyntaxError) {
        console.error(`Error: Invalid JSON format in file ''. `);
      } else {
        console.error(`Error reading or parsing file '':`, error.message);
      }
      // Ensure program exits or indicates failure clearly if needed, e.g., process.exit(1)
      return; 
    }

    const updatedSecrets = { ...existingSecrets, ...newSecretsFromFile };
    await saveSecrets(updatedSecrets);

    const importedKeys = Object.keys(newSecretsFromFile);
    if (importedKeys.length > 0) {
      console.log(`Successfully imported  secret(s) from '${filepath}':`);
      importedKeys.forEach(key => {
        // Check if the key is actually a property of newSecretsFromFile to avoid iterating prototype properties
        if (Object.prototype.hasOwnProperty.call(newSecretsFromFile, key)) {
            if (Object.prototype.hasOwnProperty.call(existingSecrets, key)) {
                console.log(`  - ${key} (updated)`);
            } else {
                console.log(`  - ${key} (added)`);
            }
        }
      });
    } else {
      console.log(`No secrets found to import in ''. Ensure the file is not empty and contains a JSON object.`);
    }
  });

program
  .command('export <filepath>')
  .description('Export all secrets to a JSON file.')
  .action(async (filepath) => {
    const secrets = await loadSecrets();
    const secretKeys = Object.keys(secrets);

    try {
      await fs.writeFile(filepath, JSON.stringify(secrets, null, 2), 'utf-8');
      if (secretKeys.length > 0) {
        console.log(`Successfully exported  secret(s) to '${filepath}'.`);
      } else {
        console.log(`No secrets found to export. An empty JSON object has been written to ''.`);
      }
    } catch (error) {
      console.error(`Error exporting secrets to '':`, error.message);
      // Optionally, exit with an error code: process.exit(1);
    }
  });

program.parse(process.argv);

// If no command is given, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
