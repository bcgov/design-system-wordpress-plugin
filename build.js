const { execSync } = require('child_process');

const blockPath = process.argv[2]; // Get the block path from the command line argument

if (!blockPath) {
    console.error('Please provide a block path to build.');
    process.exit(1);
}

// Construct the command to build the specified block
const command = `cd ${blockPath} && wp-scripts build`;

try {
    execSync(command, { stdio: 'inherit' }); // Execute the command
} catch (error) {
    console.error(`Error building block at ${blockPath}:`, error.message);
    process.exit(1);
}