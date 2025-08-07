# Deployment Guide

This guide ensures smooth deployments on Render Web Service and Netlify.

## 🚀 Quick Deploy

### Netlify (Frontend Only - Recommended for SPA)

1. Connect your repository to Netlify
2. Use these build settings:
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `dist/spa`
   - **Functions directory**: `netlify/functions`

### Render (Full-Stack - Recommended for Backend + Frontend)

1. Create a new Web Service on Render
2. Use these settings:
   - **Build command**: `npm ci && npm run build:full`
   - **Start command**: `npm start`
   - **Environment**: Node.js
   - **Auto-Deploy**: Yes

## 📦 Build Scripts

- `npm run build` - Build frontend only (Netlify)
- `npm run build:client` - Build React SPA
- `npm run build:server` - Build Express server
- `npm run build:full` - Build both frontend and backend
- `npm start` - Start production server
- `npm run dev` - Development server

## 🔧 Configuration Files

### For Netlify:

- `netlify.toml` - Netlify configuration
- `netlify/functions/` - Serverless functions

### For Render:

- `render.yaml` - Render service configuration
- `Dockerfile` - Container deployment (optional)

### General:

- `.nvmrc` - Node.js version (18)
- `package.json` - Scripts and dependencies

## 🌐 Environment Variables

### Required for Production:

```bash
NODE_ENV=production
PORT=8080
```

### Optional (for specific features):

```bash
# Database
DATABASE_URL=your_database_url

# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Email (if using)
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 🔍 Build Optimization

The build is optimized with:

- **Code splitting**: Separate chunks for vendor, router, UI, and utils
- **Tree shaking**: Remove unused code
- **Minification**: Optimized for production
- **Source maps**: For debugging in production
- **Static asset caching**: 1-day cache for static files

## 🐛 Troubleshooting

### Build Issues:

1. **Node version**: Ensure using Node.js 18+ (check `.nvmrc`)
2. **Dependencies**: Run `npm ci` for clean install
3. **Memory**: Increase memory if needed: `NODE_OPTIONS="--max-old-space-size=4096"`

### Deployment Issues:

1. **Port binding**: App listens on `process.env.PORT || 8080`
2. **Static files**: Frontend served from `/dist/spa`
3. **API routes**: Backend routes prefixed with `/api/`
4. **SPA routing**: All non-API routes serve `index.html`

### Performance:

1. **Bundle size**: Large chunks are split automatically
2. **Caching**: Static assets cached for 1 day
3. **Compression**: Gzip enabled for all assets

## 🔒 Security Headers

Configured in `netlify.toml` and server:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Content Security Policy with Supabase support

## 📱 Health Checks

- **Endpoint**: `GET /api/ping`
- **Docker**: Health check configured
- **Render**: Automatic health monitoring

## 🚢 Deploy Commands

### Netlify:

```bash
# Manual deploy
netlify deploy --prod

# Preview deploy
netlify deploy
```

### Render:

```bash
# Triggers automatic deploy on git push
git push origin main
```

### Docker:

```bash
# Build image
docker build -t fusion-starter .

# Run container
docker run -p 8080:8080 fusion-starter
```

## ✅ Pre-deployment Checklist

- [ ] All environment variables set
- [ ] Build completes without errors: `npm run build:full`
- [ ] Tests pass: `npm test`
- [ ] TypeScript checks pass: `npm run lint`
- [ ] No console errors in production build
- [ ] Health check endpoint working: `curl /api/ping`
- [ ] Static files served correctly
- [ ] SPA routing works for all routes
- [ ] API endpoints respond correctly

---

For additional help, check the platform-specific documentation:

- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
