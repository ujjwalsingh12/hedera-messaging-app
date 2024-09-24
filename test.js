const args = process.argv.slice(2); // Slice to skip the first two elements

if (args.length === 0) {
    console.log('No arguments provided.');
} else {
    console.log('Command-line arguments:');
    args.forEach((arg, index) => {
        console.log(`${index + 1}: ${arg}`);
    });
}