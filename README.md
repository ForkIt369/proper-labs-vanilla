# Proper Labs Documentation - Vanilla Version

## 🚀 Overview

A clean, vanilla HTML/JS/CSS documentation platform with an integrated admin panel for Proper Labs. This version uses no heavy frameworks - just pure web technologies with HTMX for enhanced interactivity.

## ✨ Features

- **Pure Vanilla Stack**: HTML, CSS, JavaScript - no build process required
- **Admin Panel**: Browser-based content editor with GitHub integration
- **Enhanced Markdown**: Custom extensions for admonitions, tabs, and more
- **DDV Codex Design System**: Beautiful, consistent styling
- **Vercel Edge Functions**: Serverless API for authentication and content management
- **Live Preview**: Real-time markdown preview as you type
- **Version Control**: Direct GitHub integration for content versioning

## 📁 Project Structure

```
proper-labs-vanilla/
├── index.html           # Main documentation page
├── admin.html           # Admin panel interface
├── broverse.html        # Broverse project page
├── css/
│   ├── ddv-codex.css   # DDV Codex Design System
│   ├── styles.css      # Main site styles
│   └── admin.css       # Admin panel styles
├── js/
│   ├── main.js         # Main site functionality
│   ├── admin.js        # Admin panel logic
│   └── editor.js       # Markdown editor enhancements
├── api/
│   ├── auth.js         # Authentication Edge Function
│   └── content.js      # Content management Edge Function
├── content/
│   └── pages/          # Markdown documentation files
├── vercel.json         # Vercel configuration
└── package.json        # Project metadata
```

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ForkIt369/proper-labs-vanilla.git
cd proper-labs-vanilla
```

2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Run development server:
```bash
vercel dev
```

4. Open http://localhost:3000

### Production Deployment

```bash
vercel --prod
```

## 🔐 Admin Panel

### Access
- URL: `/admin.html`
- Password: Set in environment variable `ADMIN_PASSWORD`

### Features
- **File Browser**: Navigate and edit documentation files
- **Markdown Editor**: Full-featured editor with syntax highlighting
- **Live Preview**: See changes in real-time
- **Enhanced Markdown**: Support for admonitions, tabs, and more
- **GitHub Integration**: Direct push to repository
- **Draft System**: Auto-save drafts to localStorage

### Markdown Extensions

#### Admonitions
```markdown
:::info
**Information**
This is an informational message.
:::

:::warning
**Warning**
This is a warning message.
:::

:::success
**Success**
Operation completed successfully!
:::

:::danger
**Danger**
Critical information here.
:::
```

#### Tabs
```markdown
:::tabs
::tab{label="JavaScript"}
\`\`\`javascript
console.log('Hello World');
\`\`\`
::
::tab{label="Python"}
\`\`\`python
print("Hello World")
\`\`\`
::
:::
```

## 🔧 Configuration

### Environment Variables

Create these in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub personal access token | `ghp_xxxxxxxxxxxx` |
| `GITHUB_OWNER` | GitHub username or org | `ForkIt369` |
| `GITHUB_REPO` | Repository name | `proper-labs-vanilla` |
| `ADMIN_PASSWORD` | Admin panel password | `YourSecurePassword123!` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key-here` |

### GitHub Token Setup

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scope: `repo` (full control)
4. Copy token and add to Vercel environment variables

## 🎨 Design System

The site uses the DDV Codex Design System v3.1:

- **Colors**: Agent-themed palette (BigSis Blue, Bro Orange, LilSis Purple, CBO Green)
- **Typography**: DM Sans (headings) + Inter (body) + JetBrains Mono (code)
- **Grid**: Strict 8px grid system
- **Components**: Cards, buttons, forms, all following the design system

## 📝 Content Management

### Creating New Pages

1. Access admin panel at `/admin.html`
2. Click "New" button in file browser
3. Enter page name (e.g., "getting-started")
4. Write content in markdown
5. Save as draft or publish directly to GitHub

### File Organization

```
content/
├── pages/          # Main documentation pages
│   ├── overview.md
│   ├── broverse.md
│   ├── verseid.md
│   └── ...
├── drafts/         # Work in progress (localStorage)
└── assets/         # Images and other assets
```

## 🚢 Deployment

### Vercel Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import in Vercel:
   - Go to https://vercel.com
   - Import GitHub repository
   - Configure environment variables
   - Deploy

### Manual Deployment

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

## 🛠️ Development

### No Build Process

This project intentionally uses no build tools. Simply edit files and reload:

- HTML files for structure
- CSS files for styling
- JS files for functionality
- Markdown files for content

### Testing Edge Functions Locally

```bash
vercel dev
```

This runs Edge Functions locally for testing authentication and GitHub integration.

## 📚 API Reference

### Authentication Endpoint

```
POST /api/auth
Body: { "password": "admin-password" }
Response: { "token": "jwt-token" }
```

### Content Endpoints

```
GET /api/content
- List all files

GET /api/content/[path]
- Get specific file content

POST /api/content
Body: { "path": "file-path", "content": "markdown", "message": "commit-message" }
- Create or update file
```

## 🆘 Troubleshooting

### Admin login fails
- Check `ADMIN_PASSWORD` environment variable
- Clear browser cache/localStorage
- Check browser console for errors

### GitHub sync fails
- Verify GitHub token hasn't expired
- Ensure token has `repo` scope
- Check repository permissions

### Preview not updating
- Click refresh button in preview pane
- Check for JavaScript errors in console
- Ensure marked.js is loaded

## 📄 License

© 2024 Proper Labs. All rights reserved.

---

Built with ❤️ using vanilla web technologies and the DDV Codex Design System