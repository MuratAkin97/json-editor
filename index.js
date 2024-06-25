import { write } from 'bun';
import { readFile } from 'node:fs/promises';
import readline from 'readline';

// Function to apply JS code to a JS object
function applyCodeToObject(jsCode, jsObject) {
  try {
    const func = new Function('obj', `with(obj) { ${jsCode}; return obj; }`);
    return func(jsObject);
  } catch (error) {
    return { error: 'Error applying code to object', details: error.message };
  }
}

// Function to read a local JSON file
async function readJSONFile(filePath) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Function to prompt user for JS code
function promptUserForCode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter the JavaScript code to modify the JSON object: ', (code) => {
      rl.close();
      resolve(code);
    });
  });
}

// Function to send the modified JSON data to an HTTP endpoint
async function sendJSONData(endpoint, jsonData) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
  });

  if (!response.ok) {
    throw new Error(`Failed to send data: ${response.statusText}`);
  }

  return response.json();
}

// Main function to read from file, apply code, and send data
async function main() {
  const jsonFilePath = './data.json';  // Path to your local JSON file
  const endpoint = 'https://example.com/api/endpoint'; // Your HTTP endpoint

  // Prompt user for JavaScript code
  const jsCode = await promptUserForCode();

  // Read the JSON file
  const jsonData = await readJSONFile(jsonFilePath);
  console.log('Original JSON data:', jsonData);

  // Apply JS code to the JSON object
  const result = applyCodeToObject(jsCode, jsonData);
  console.log('Modified JSON data:', result);

  // Write the result back to the original file
  await write(jsonFilePath, JSON.stringify(result, null, 2));
  console.log(`Result saved to ${jsonFilePath}`);

  // Send the modified JSON data to the endpoint
  try {
    const response = await sendJSONData(endpoint, result);
    console.log('Response from server:', response);
  } catch (error) {
    console.error('Error sending JSON data:', error);
  }
}

main().catch(console.error);
