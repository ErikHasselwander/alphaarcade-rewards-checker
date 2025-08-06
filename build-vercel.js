#!/usr/bin/env node

// Frontend-only build script for Vercel deployment
// Runs only the Vite build without server compilation

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

async function main() {
  try {
    console.log('Building React app for Vercel deployment...');
    
    // Only run vite build, skip the server build
    await execAsync('vite build');
    
    console.log('Frontend build completed successfully!');
    
    // Check if build output exists
    if (existsSync('dist/public')) {
      console.log('✓ Build output ready at: dist/public');
      console.log('✓ Ready for Vercel deployment');
    } else {
      console.error('Build output not found at expected location');
      process.exit(1);
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();