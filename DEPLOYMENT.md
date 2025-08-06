# Deployment Guide - ALPHA Rewards Checker

## Vercel Deployment

This application is now configured for seamless deployment on Vercel as a static Single Page Application (SPA).

### Quick Deploy

1. **Connect Repository**: Import your repository to Vercel
2. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install` (default)
3. **Deploy**: Click deploy

### Configuration Files

- `vercel.json`: Handles client-side routing (SPA rewrites)
- `.vercelignore`: Excludes server files and dev dependencies
- `README.md`: Documentation and deployment instructions

### Key Features for Static Deployment

✅ **No Backend Required**: Direct integration with Algorand Indexer API  
✅ **Client-side Routing**: Full support for direct URL access (`/ADDRESS`)  
✅ **Optimized Build**: Production-ready with code splitting  
✅ **Zero Configuration**: Works out of the box with Vercel  

### Alternative Platforms

This SPA can also deploy to:
- **Netlify**: Use same build settings
- **GitHub Pages**: Set output to `dist/public`
- **Firebase Hosting**: Standard React app deployment
- **Any Static Host**: Serve the `dist/public` folder

### Performance

- **Bundle Size**: ~193 KB gzipped
- **Dependencies**: Only frontend libraries included
- **API Calls**: Direct to public Algorand Indexer (no CORS issues)

### URLs After Deployment

- **Home**: `https://your-app.vercel.app/`
- **Direct Address**: `https://your-app.vercel.app/CHMP44CAUGU7DUKKTWA65MTR6CJDHQRWDYODHA2CJ4XMOWEBFGXKPJXH7Q`

The `vercel.json` configuration ensures all URLs route correctly to the React app for client-side handling.