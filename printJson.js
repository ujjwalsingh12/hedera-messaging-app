function printJson(obj, indent = 0) {
    const indentation = '  '.repeat(indent); // Create indentation for pretty printing

    if (typeof obj !== 'object' || obj === null) {
        // Print simple values on the same line
        process.stdout.write(`${indentation}${obj}`); // Use process.stdout.write for same-line output
    } else if (Array.isArray(obj)) {
        // Handle arrays
        console.log(`${indentation}Array [`);
        obj.forEach((item, index) => {
            if (index === obj.length - 1) {
                printJson(item, indent + 1); // Last item, no newline after
            } else {
                printJson(item, indent + 1);
                console.log(',');
            }
        });
        console.log(`${indentation}]`);
    } else {
        // Handle objects
        console.log(`${indentation}{`);
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
            process.stdout.write(`${indentation}  ${key}: `); // Print key
            if (index === keys.length - 1) {
                printJson(obj[key], indent + 1); // Last property, no newline after
            } else {
                printJson(obj[key], indent + 1);
                console.log(','); // Add a comma after each property
            }
        });
        console.log(`${indentation}}`);
    }
}

module.exports = {printJson};
// const accounts = require('./keys.json');
// printJson(accounts);