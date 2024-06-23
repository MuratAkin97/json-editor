import { file, write } from 'bun';
import readline from 'readline';

// Function to read JSON file
async function readJSONFile(filePath) {
  const fileReference = file(filePath);
  const data = await fileReference.text();
  return JSON.parse(data);
}

// Function to write JSON file
async function writeJSONFile(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2);
  await write(filePath, jsonString);
}

// Function to apply changes to JSON data
function applyChanges(data, changes) {
  changes.forEach(change => {
    data[change.key] = change.value;
  });
  return data;
}

// Function to prompt user for changes
async function promptUserForChanges() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const questions = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
  };

  const changes = [];

  let addMore = true;
  while (addMore) {
    const key = await questions('Enter the key to change: ');
    const value = await questions('Enter the new value: ');
    changes.push({ key, value: JSON.parse(value) });

    const more = await questions('Do you want to add more changes? (yes/no): ');
    addMore = more.toLowerCase() === 'yes';
  }

  rl.close();
  return changes;
}

// Main function
async function main() {
  const filePath = './data.json';

  // Read the JSON file
  let jsonData = await readJSONFile(filePath);
  console.log('Original JSON data:', jsonData);

  // Prompt user for changes
  const changes = await promptUserForChanges();

  // Apply changes to JSON data
  jsonData = applyChanges(jsonData, changes);
  console.log('Modified JSON data:', jsonData);

  // Write the modified JSON data back to the file
  await writeJSONFile(filePath, jsonData);
  console.log('Changes saved to the JSON file.');
}

main().catch(console.error);
