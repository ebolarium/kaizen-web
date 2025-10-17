# Kaizen Website - Deployment Guide

## 🚀 GitHub + Render.com Deployment Strategy

### Architecture Overview
1. **Static Site (GitHub Pages)**: Public website, blog, and project showcase
2. **Web Service (Render.com)**: Admin panel with API endpoints for content management

### Phase 1: GitHub Setup

#### 1.1 Create GitHub Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Kaizen Education NGO website"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/kaizen-website.git
git branch -M main
git push -u origin main
```

#### 1.2 GitHub Repository Settings
1. **Repository Settings** → **Pages**:
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`

2. **Repository Settings** → **Actions** → **General**:
   - Allow all actions and reusable workflows: ✅

3. **Repository Settings** → **Secrets and Variables** → **Actions**:
   - Add `JWT_SECRET`: Your secure JWT secret key
   - Add `ADMIN_PASSWORD`: Your admin password (will be hashed)

#### 1.3 GitHub Pages Configuration
- **Custom Domain**: Set your domain (optional)
- **HTTPS**: Enforce HTTPS ✅
- **Build Command**: `npm run build`
- **Publish Directory**: `out`

### Phase 2: Render.com Setup

#### 2.1 Web Service Configuration
1. **Create New Web Service**:
   - Connect GitHub repository
   - Runtime: Node.js
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Environment Variables**:
   ```
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   GITHUB_TOKEN=your-github-token
   GITHUB_REPO=YOUR_USERNAME/kaizen-website
   ```

3. **Advanced Settings**:
   - Auto-Deploy: ✅
   - Branch: `main`

### Phase 3: Data Management Strategy

#### 3.1 GitHub as Data Source
- Store JSON data files in `/src/data/` directory
- Use GitHub API to read/write data from admin panel
- Enable GitHub Actions for automated deployments

#### 3.2 File Structure
```
kaizen-website/
├── src/data/           # JSON data files (GitHub)
│   ├── projects.json
│   ├── blog-posts.json
│   └── admin-config.json
├── public/images/      # Static assets
└── admin/             # Admin panel (Render.com only)
```

### Phase 4: Security Considerations

#### 4.1 GitHub Permissions
- **Repository**: Private (recommended) or Public
- **Actions**: Enabled for CI/CD
- **Pages**: Public access for static site

#### 4.2 Admin Security
- Strong JWT secret (32+ characters)
- Secure admin password (use bcrypt)
- Rate limiting on API endpoints
- HTTPS enforcement

### Phase 5: Development Workflow

#### 5.1 Local Development
```bash
npm install
npm run dev
```

#### 5.2 Content Updates
1. **Via Admin Panel**: Use Render.com web service
2. **Via GitHub**: Direct file editing
3. **Via API**: Automated content management

### Phase 6: Monitoring & Maintenance

#### 6.1 GitHub Actions
- Automated builds on push
- Deploy static site to Pages
- Deploy web service to Render.com

#### 6.2 Backup Strategy
- GitHub repository as primary backup
- Regular exports of JSON data
- Image assets in `/public/images/`

## 🔧 Environment Variables

### Required for Production
```env
JWT_SECRET=your-secure-jwt-secret-key-32-chars-min
NODE_ENV=production
GITHUB_TOKEN=ghp_your_github_token
GITHUB_REPO=YOUR_USERNAME/kaizen-website
```

### Optional
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
ADMIN_EMAIL=admin@kaizen.org
CONTACT_EMAIL=info@kaizen.org
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Remove sensitive data from repository
- [ ] Set up GitHub repository
- [ ] Configure GitHub Pages
- [ ] Create GitHub token with repo access
- [ ] Test local build process

### Deployment
- [ ] Deploy static site to GitHub Pages
- [ ] Deploy web service to Render.com
- [ ] Configure environment variables
- [ ] Test admin functionality
- [ ] Verify API endpoints

### Post-Deployment
- [ ] Update DNS records (if custom domain)
- [ ] Test all functionality
- [ ] Set up monitoring
- [ ] Create backup procedures

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **API Errors**: Verify environment variables
3. **Image Upload Issues**: Check file permissions
4. **Authentication Problems**: Verify JWT secret

### Support
- Check GitHub Actions logs
- Review Render.com deployment logs
- Verify environment variables
- Test API endpoints manually
