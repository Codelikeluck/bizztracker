const fs = require('fs');
const path = require('path');

function extractColors(nodes) {
  const colors = new Map();
  
  nodes.forEach(node => {
    if (node.fillPaints) {
      node.fillPaints.forEach(paint => {
        if (paint.type === 'SOLID' && paint.visible !== false) {
          const { r, g, b, a } = paint.color;
          const hex = '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
          if (!colors.has(hex)) {
            colors.set(hex, {
              hex,
              rgb: `rgb(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`,
              name: node.name
            });
          }
        }
      });
    }
  });
  
  return Array.from(colors.values());
}

function extractTypography(nodes) {
  const typography = new Map();
  
  nodes.forEach(node => {
    if (node.type === 'TEXT' && node.fontName) {
      const key = `${node.fontName.family}-${node.fontName.style}-${node.fontSize}`;
      if (!typography.has(key)) {
        typography.set(key, {
          family: node.fontName.family,
          style: node.fontName.style,
          size: node.fontSize,
          lineHeight: node.lineHeight,
          letterSpacing: node.letterSpacing
        });
      }
    }
  });
  
  return Array.from(typography.values());
}

function extractComponents(nodes) {
  const components = [];
  
  nodes.forEach(node => {
    if (node.type === 'SYMBOL' || node.type === 'COMPONENT') {
      components.push({
        name: node.name,
        type: node.type,
        size: node.size,
        visible: node.visible
      });
    }
  });
  
  return components;
}

function main() {
  const inputPath = path.join(__dirname, '..', 'parsed-output', 'openfig-output.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error('Run parse-fig.js first to generate the parsed output.');
    process.exit(1);
  }
  
  console.log('Extracting design tokens from parsed Figma data...\n');
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const nodes = data.nodes || [];
  
  const colors = extractColors(nodes);
  const typography = extractTypography(nodes);
  const components = extractComponents(nodes);
  
  const tokens = {
    colors,
    typography,
    components,
    summary: {
      totalNodes: nodes.length,
      uniqueColors: colors.length,
      uniqueTypography: typography.length,
      totalComponents: components.length
    }
  };
  
  const outputPath = path.join(__dirname, '..', 'parsed-output', 'design-tokens.json');
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
  
  console.log('Design Tokens Extracted:');
  console.log('========================');
  console.log(`Total Nodes: ${tokens.summary.totalNodes}`);
  console.log(`Unique Colors: ${tokens.summary.uniqueColors}`);
  console.log(`Unique Typography: ${tokens.summary.uniqueTypography}`);
  console.log(`Total Components: ${tokens.summary.totalComponents}`);
  
  console.log('\nColors found:');
  colors.slice(0, 10).forEach(c => console.log(`  ${c.hex} (${c.name})`));
  if (colors.length > 10) console.log(`  ... and ${colors.length - 10} more`);
  
  console.log('\nTypography found:');
  typography.forEach(t => console.log(`  ${t.family} ${t.style} - ${t.size}px`));
  
  console.log('\nComponents found:');
  components.slice(0, 10).forEach(c => console.log(`  ${c.name} (${c.type})`));
  if (components.length > 10) console.log(`  ... and ${components.length - 10} more`);
  
  console.log('\nTokens saved to:', outputPath);
}

main();
