const fs = require('fs');
const path = require('path');

console.log('Testing Figma parsers...\n');

// Test fig-to-json
try {
  const { parseFigFile } = require('fig-to-json');
  console.log('✓ fig-to-json loaded successfully');
} catch (err) {
  console.log('✗ fig-to-json failed to load:', err.message);
}

// Test openfig-core
try {
  const { parseFig } = require('openfig-core');
  console.log('✓ openfig-core loaded successfully');
} catch (err) {
  console.log('✗ openfig-core failed to load:', err.message);
}

// Check if fig file exists
const figPath = path.join(__dirname, '..', 'Mobile UI kit (Community).fig');
if (fs.existsSync(figPath)) {
  console.log('\n✓ Figma file found:', figPath);
  console.log('  Size:', (fs.statSync(figPath).size / 1024 / 1024).toFixed(2), 'MB');
} else {
  console.log('\n✗ Figma file not found at:', figPath);
}

console.log('\nParser test complete.');
