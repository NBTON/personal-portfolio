const fs = require('fs-extra');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Configuration
const config = {
  srcDir: './',
  distDir: './dist',
  jsFiles: [
    { src: 'js/main.js', dest: 'js/main.min.js' }
  ],
  cssFiles: [
    { src: 'css/styles.css', dest: 'css/styles.min.css' }
  ],
  assets: [
    'favicon.ico',
    'Images/'
  ],
  htmlFiles: [
    'index.html'
  ]
};

// Parse command line arguments
const isDevMode = process.argv.includes('--dev');

async function cleanDist() {
  console.log('Cleaning dist directory...');
  try {
    await fs.remove(config.distDir);
  } catch (error) {
    console.log('Warning: Could not fully remove dist directory. Continuing with build...');
  }
  await fs.ensureDir(config.distDir);
  console.log('Dist directory cleaned.');
}

async function minifyJS() {
  console.log('Minifying JavaScript files...');
  
  for (const file of config.jsFiles) {
    const srcPath = path.join(config.srcDir, file.src);
    const destPath = path.join(config.distDir, file.dest);
    
    // Ensure destination directory exists
    await fs.ensureDir(path.dirname(destPath));
    
    // Read source file
    const code = await fs.readFile(srcPath, 'utf8');
    
    if (isDevMode) {
      // In dev mode, just copy without minifying
      await fs.copy(srcPath, destPath);
      console.log(`Copied ${file.src} to ${file.dest} (dev mode)`);
    } else {
      // Minify the code
      const minified = await minify(code, {
        compress: true,
        mangle: true
      });
      
      // Write minified code
      await fs.writeFile(destPath, minified.code);
      console.log(`Minified ${file.src} to ${file.dest}`);
    }
  }
}

async function minifyCSS() {
  console.log('Minifying CSS files...');
  
  for (const file of config.cssFiles) {
    const srcPath = path.join(config.srcDir, file.src);
    const destPath = path.join(config.distDir, file.dest);
    
    // Ensure destination directory exists
    await fs.ensureDir(path.dirname(destPath));
    
    // Read source file
    const code = await fs.readFile(srcPath, 'utf8');
    
    if (isDevMode) {
      // In dev mode, just copy without minifying
      await fs.copy(srcPath, destPath);
      console.log(`Copied ${file.src} to ${file.dest} (dev mode)`);
    } else {
      // Minify the code
      const minified = new CleanCSS({}).minify(code);
      
      // Write minified code
      await fs.writeFile(destPath, minified.styles);
      console.log(`Minified ${file.src} to ${file.dest}`);
    }
  }
}

async function copyAssets() {
  console.log('Copying assets...');
  
  for (const asset of config.assets) {
    const srcPath = path.join(config.srcDir, asset);
    const destPath = path.join(config.distDir, asset);
    
    // Check if it's a directory or file
    const stat = await fs.stat(srcPath);
    
    if (stat.isDirectory()) {
      // Copy directory recursively
      await fs.copy(srcPath, destPath);
      console.log(`Copied directory ${asset} to dist`);
    } else {
      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));
      
      // Copy file
      await fs.copy(srcPath, destPath);
      console.log(`Copied ${asset} to dist`);
    }
  }
}

async function updateHTMLReferences() {
  console.log('Updating HTML references...');
  
  for (const htmlFile of config.htmlFiles) {
    const srcPath = path.join(config.srcDir, htmlFile);
    const destPath = path.join(config.distDir, htmlFile);
    
    // Read HTML file
    let html = await fs.readFile(srcPath, 'utf8');
    
    // Update CSS references
    for (const file of config.cssFiles) {
      const originalSrc = file.src;
      const minifiedSrc = isDevMode ? file.src : file.dest;
      
      // Create regex to match the CSS file reference
      const cssRegex = new RegExp(`href=["']${originalSrc}["']`, 'g');
      html = html.replace(cssRegex, `href="${minifiedSrc}"`);
    }
    
    // Update JavaScript references
    for (const file of config.jsFiles) {
      const originalSrc = file.src;
      const minifiedSrc = isDevMode ? file.src : file.dest;
      
      // Create regex to match the JS file reference
      const jsRegex = new RegExp(`src=["']${originalSrc}["']`, 'g');
      html = html.replace(jsRegex, `src="${minifiedSrc}"`);
    }
    
    // Write updated HTML
    await fs.writeFile(destPath, html);
    console.log(`Updated references in ${htmlFile}`);
  }
}

async function build() {
  try {
    console.log(`Starting ${isDevMode ? 'development' : 'production'} build...`);
    
    // Clean dist directory
    await cleanDist();
    
    // Minify JS
    await minifyJS();
    
    // Minify CSS
    await minifyCSS();
    
    // Copy assets
    await copyAssets();
    
    // Update HTML references
    await updateHTMLReferences();
    
    console.log(`Build completed successfully!`);
    console.log(`Output directory: ${config.distDir}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();