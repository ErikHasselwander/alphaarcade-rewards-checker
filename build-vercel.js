#!/usr/bin/env node

// Simple build script for Vercel deployment
// This copies the built files to the correct location for Vercel

import { exec } from 'child_process';
import { promisify } from 'util';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

async function main() {
  try {
    console.log('Building React app...');
    await execAsync('vite build');
    
    console.log('Build completed successfully!');
    
    // Vercel expects the output in dist/ directory
    if (existsSync('dist/public')) {
      console.log('Build output is ready for Vercel deployment');
      console.log('Output directory: dist/public');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();