const fs = require('fs');
const path = require('path');

async function parseWithFigToJson(filePath) {
  console.log('\n=== Parsing with fig-to-json ===');
  try {
    const { parseFigFile, cleanTree, extractTokens } = require('fig-to-json');
    const buffer = fs.readFileSync(filePath);
    const data = await parseFigFile(buffer);
    
    if (data && data.document) {
      const cleaned = cleanTree(data.document);
      const tokens = extractTokens(cleaned);
      
      console.log('Document name:', data.name || 'Unknown');
      console.log('Pages found:', cleaned.children ? cleaned.children.length : 0);
      
      if (tokens) {
        console.log('Colors found:', tokens.colors ? tokens.colors.length : 0);
        console.log('Typography found:', tokens.typography ? tokens.typography.length : 0);
        console.log('Spacing found:', tokens.spacing ? tokens.spacing.length : 0);
      }
      
      return { cleaned, tokens };
    }
    return null;
  } catch (err) {
    console.log('fig-to-json error:', err.message);
    return null;
  }
}

async function parseWithOpenfig(filePath) {
  console.log('\n=== Parsing with openfig-core ===');
  try {
    const { parseFig } = require('openfig-core');
    const buffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(buffer);
    const doc = await parseFig(uint8Array);
    
    if (doc) {
      console.log('Document parsed successfully');
      console.log('Pages:', doc.pages ? doc.pages.length : 0);
      
      if (doc.pages && doc.pages.length > 0) {
        doc.pages.forEach((page, i) => {
          console.log(`  Page ${i + 1}: ${page.name || 'Unnamed'}`);
          if (page.children) {
            console.log(`    Children: ${page.children.length}`);
          }
        });
      }
      
      return doc;
    }
    return null;
  } catch (err) {
    console.log('openfig-core error:', err.message);
    return null;
  }
}

async function main() {
  const figPath = path.join(__dirname, '..', 'Mobile UI kit (Community).fig');
  
  if (!fs.existsSync(figPath)) {
    console.error('Figma file not found:', figPath);
    process.exit(1);
  }
  
  console.log('Parsing Figma file:', figPath);
  console.log('File size:', (fs.statSync(figPath).size / 1024 / 1024).toFixed(2), 'MB');
  
  const result1 = await parseWithFigToJson(figPath);
  const result2 = await parseWithOpenfig(figPath);
  
  // Save results
  const outputDir = path.join(__dirname, '..', 'parsed-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  if (result1) {
    fs.writeFileSync(
      path.join(outputDir, 'fig-to-json-output.json'),
      JSON.stringify(result1, null, 2)
    );
    console.log('\nSaved fig-to-json output to:', outputDir);
  }
  
  if (result2) {
    fs.writeFileSync(
      path.join(outputDir, 'openfig-output.json'),
      JSON.stringify(result2, null, 2)
    );
    console.log('Saved openfig-core output to:', outputDir);
  }
  
  console.log('\nParsing complete!');
}

main().catch(console.error);
