const fs = require('fs');
const path = require('path');

// Read the generated file
const genFile = 'c:\\Users\\ADM\\Documents\\Programação\\Spark\\leds-tools-spark-lib\\tests\\frontend\\src\\components\\icons\\IconNav.vue';
const genContent = fs.readFileSync(genFile, 'utf-8');

// Read the test file and extract the expected content
const testFile = 'c:\\Users\\ADM\\Documents\\Programação\\Spark\\leds-tools-spark-lib\\tests\\aux_frontend_tests\\srcExpectedFiles\\componentsDatas.ts';
const testContent = fs.readFileSync(testFile, 'utf-8');

// Extract content between expandToString` and the closing `
const match = testContent.match(/srcComponentsFiles\[iconNav\] = `([\s\S]*?)`;\s*srcComponentsFiles\[navGroup\]/);
if (!match) {
    console.log('ERROR: Could not extract expected content');
    process.exit(1);
}

let expectedContent = match[1];

console.log('Generated length:', genContent.length);
console.log('Expected length:', expectedContent.length);
console.log('Are they equal?', genContent === expectedContent);

// Find first difference
for (let i = 0; i < Math.min(genContent.length, expectedContent.length); i++) {
    if (genContent[i] !== expectedContent[i]) {
        console.log('\nFirst difference at position', i);
        console.log('Generated char:', genContent.charCodeAt(i), `'${genContent[i]}'`);
        console.log('Expected char:', expectedContent.charCodeAt(i), `'${expectedContent[i]}'`);
        console.log('Gen context:', genContent.substring(Math.max(0, i-30), i+30));
        console.log('Exp context:', expectedContent.substring(Math.max(0, i-30), i+30));
        break;
    }
}

// Write to files for comparison
fs.writeFileSync('c:\\Users\\ADM\\Documents\\Programação\\Spark\\leds-tools-spark-lib\\debug_gen.txt', genContent);
fs.writeFileSync('c:\\Users\\ADM\\Documents\\Programação\\Spark\\leds-tools-spark-lib\\debug_exp.txt', expectedContent);
console.log('\nFiles written for comparison');
