# Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)

1. **Via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

2. **Via Netlify Dashboard**
   - Push your code to GitHub
   - Go to netlify.com and click "New site from Git"
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

### Option 2: Vercel

1. **Via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Via Vercel Dashboard**
   - Push code to GitHub
   - Go to vercel.com
   - Click "Import Project"
   - Select your repository
   - Framework Preset: Vite
   - Click "Deploy"

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Update vite.config.js:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/'
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: AWS S3 + CloudFront

1. Build the project:
   ```bash
   npm run build
   ```

2. Create S3 bucket and enable static website hosting

3. Upload `dist` folder contents to S3

4. Set up CloudFront distribution

5. Update DNS to point to CloudFront

### Option 5: Traditional Hosting (cPanel, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload contents of `dist` folder to your web server's public_html directory

3. Ensure your server is configured to serve index.html for all routes (for React Router):

   **Apache (.htaccess)**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Environment Variables

If you need environment variables:

1. Create `.env` file in root:
   ```
   VITE_API_URL=https://api.example.com
   VITE_CONTACT_EMAIL=hello@rainbootsmarketing.com
   ```

2. Access in code:
   ```js
   const apiUrl = import.meta.env.VITE_API_URL
   ```

3. Add to `.gitignore`:
   ```
   .env
   .env.local
   ```

## Custom Domain

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records as instructed

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records

## Performance Optimization

Before deploying:

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use appropriate sizes

2. **Enable Compression**
   - Netlify/Vercel do this automatically
   - For other hosts, enable gzip/brotli

3. **Set Cache Headers**
   - Cache static assets
   - Set proper cache-control headers

## Monitoring

After deployment:

1. **Check Lighthouse Score**
   - Open DevTools
   - Run Lighthouse audit
   - Target: 90+ score

2. **Test on Multiple Devices**
   - Mobile
   - Tablet
   - Desktop

3. **Check All Routes**
   - Test navigation
   - Verify forms work
   - Check animations

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify base path in vite.config.js
- Check server routing for React Router

### 404 on Refresh
- Configure server to serve index.html for all routes
- Add _redirects file for Netlify:
  ```
  /* /index.html 200
  ```

### Assets Not Loading
- Check base path configuration
- Verify asset paths are relative
- Check browser console for 404s

## Contact Form Setup

The contact form currently logs to console. To make it functional:

1. **Option A: Email Service (EmailJS)**
   ```bash
   npm install @emailjs/browser
   ```

2. **Option B: Backend API**
   - Create serverless function
   - Deploy to Netlify/Vercel Functions

3. **Option C: Form Service**
   - Use Formspree, Netlify Forms, or similar
   - Update form action attribute

## Support

Need help? Contact: hello@rainbootsmarketing.com
