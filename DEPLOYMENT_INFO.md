# 🚀 Proper Labs Vanilla - Deployment Information

## Live URLs

### Production Site
- **Main Site**: https://proper-labs-vanilla.vercel.app
- **Admin Panel**: https://proper-labs-vanilla.vercel.app/admin.html
- **GitHub Repository**: https://github.com/ForkIt369/proper-labs-vanilla

### Alternative URLs (all work)
- https://proper-labs-vanilla-2d8t0qzay-will31s-projects.vercel.app
- https://proper-labs-vanilla-will31s-projects.vercel.app

## 🔐 Admin Access Credentials

### Admin Panel Login
- **URL**: https://proper-labs-vanilla.vercel.app/admin.html
- **Password**: `ProperLabsVanilla2024!`

## 📋 Environment Variables (Already Configured in Vercel)

| Variable | Value | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | `gho_Lg3Q...` (hidden) | GitHub API access |
| `GITHUB_OWNER` | `ForkIt369` | Your GitHub username |
| `GITHUB_REPO` | `proper-labs-vanilla` | Repository name |
| `ADMIN_PASSWORD` | `ProperLabsVanilla2024!` | Admin panel access |
| `JWT_SECRET` | `proper-labs-vanilla-jwt...` (hidden) | JWT signing key |

## 📝 How to Use the Admin Panel

1. **Access the Admin Panel**
   - Go to: https://proper-labs-vanilla.vercel.app/admin.html
   - Enter password: `ProperLabsVanilla2024!`

2. **Edit Documentation**
   - Click on any file in the left sidebar
   - Edit using the markdown editor
   - See live preview on the right
   - Use toolbar buttons for formatting

3. **Save Your Work**
   - **Save Draft**: Saves locally in browser (auto-saves every 30 seconds)
   - **Publish to GitHub**: Commits directly to GitHub
   - Changes auto-deploy to live site in ~30 seconds

4. **Markdown Features Available**
   - **Admonitions**: `:::info`, `:::warning`, `:::success`, `:::danger`
   - **Tabs**: `:::tabs` with `::tab{label="..."}` sections
   - **Code blocks**: With syntax highlighting
   - **Standard markdown**: Headers, lists, links, images, tables

## 🔄 Auto-Deployment

Every push to GitHub automatically triggers:
1. GitHub webhook to Vercel
2. Build and deployment process
3. Live in ~30 seconds
4. No build step required (pure static files)

## 🛠️ Managing Content

### Creating New Pages
1. Click "New" button in admin panel
2. Enter page name (e.g., "getting-started")
3. Content is created with template
4. Save draft or publish directly

### File Structure
```
proper-labs-vanilla/
├── index.html           # Main documentation page
├── admin.html           # Admin panel
├── content/
│   └── pages/          # Markdown documentation files
├── css/                # Styles (DDV Codex)
├── js/                 # JavaScript functionality
└── api/                # Vercel Edge Functions
```

## 🔧 Maintenance

### Updating Environment Variables
```bash
vercel env add VARIABLE_NAME production
vercel --prod  # Redeploy to apply
```

### Viewing Deployment Logs
```bash
vercel logs proper-labs-vanilla
```

### Local Development
```bash
vercel dev
# Runs on http://localhost:3000 with Edge Functions
```

## 📊 Analytics

View deployment analytics at:
- https://vercel.com/will31s-projects/proper-labs-vanilla

## 🆘 Troubleshooting

### If admin login fails:
1. Clear browser cache/localStorage
2. Verify password: `ProperLabsVanilla2024!`
3. Check browser console for errors

### If GitHub sync fails:
1. Verify GitHub token hasn't expired
2. Check token has `repo` scope
3. Verify repository permissions

### Common Issues:
- **Edge Functions not working**: Redeploy with `vercel --prod`
- **Environment variables not loading**: Check Vercel dashboard settings
- **CORS errors**: Check vercel.json configuration

## 🌟 Key Differences from Docusaurus Version

This vanilla version:
- ✅ No build process required
- ✅ Instant updates (no compilation)
- ✅ Lightweight and fast
- ✅ Full control over HTML/CSS/JS
- ✅ Admin panel works directly in browser
- ✅ Uses Vercel Edge Functions (not Node.js)
- ✅ Pure vanilla - no React, no frameworks

## 📚 Support

- Vercel Dashboard: https://vercel.com/will31s-projects/proper-labs-vanilla
- GitHub Issues: https://github.com/ForkIt369/proper-labs-vanilla/issues

---

**Successfully Deployed!** 🎉

The Proper Labs Vanilla Documentation Platform is now live with:
- ✅ Pure vanilla HTML/JS/CSS
- ✅ Beautiful DDV Codex design
- ✅ Working admin panel at /admin.html
- ✅ GitHub integration via Edge Functions
- ✅ Enhanced markdown support
- ✅ Auto-deployment on every push
- ✅ No build process required

Start editing at: https://proper-labs-vanilla.vercel.app/admin.html