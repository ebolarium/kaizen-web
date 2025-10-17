# Kaizen Website - Deployment Guide

## Deploying to Render.com

### Prerequisites
1. A GitHub repository with your code
2. A Render.com account
3. Your code pushed to the main branch

### Deployment Steps

#### 1. Create a New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Choose the repository containing the Kaizen website

#### 2. Configure the Service
- **Name**: `kaizen-website` (or your preferred name)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Choose based on your needs (Free tier available)

#### 3. Environment Variables
Set the following environment variables in Render:

```
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=production
```

#### 4. Advanced Settings
- **Auto-Deploy**: Enable to automatically deploy on git push
- **Branch**: `main` (or your default branch)

### Local Development

#### Prerequisites
- Node.js 18+ 
- npm or yarn

#### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file with environment variables
4. Run development server: `npm run dev`

#### Environment Variables for Local Development
Create a `.env.local` file:

```
JWT_SECRET=your-local-secret-key
NODE_ENV=development
```

### Admin Access

#### Default Admin Credentials
- **Username**: `admin`
- **Password**: `password` (change this in production!)

#### Changing Admin Password
1. Go to `/admin/login`
2. Use the default credentials
3. Update the password hash in `src/data/admin-config.json`
4. Use bcrypt to hash your new password

### File Structure
```
kaizen-website/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   └── data/               # JSON data files
├── public/
│   └── images/             # Static images and uploads
├── package.json
└── next.config.ts
```

### Features
- ✅ Static site generation for performance
- ✅ Admin login system with JWT authentication
- ✅ Project management (Local and Erasmus+ projects)
- ✅ Blog post management
- ✅ Image upload system
- ✅ Responsive design with Tailwind CSS
- ✅ SEO optimized

### Project Hierarchy
- **Local Projects**: Community-focused initiatives
- **Erasmus+ K1 Projects**: 
  - K152: Digital Skills for Education
  - K153: Environmental Sustainability Education
- **Erasmus+ K2 Projects**:
  - K210: Innovative Teaching Methods
  - K220: Cultural Heritage Preservation

### Support
For issues or questions, please contact the development team.
