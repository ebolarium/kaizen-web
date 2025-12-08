# Database Migration - Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kaizen-ngo
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kaizen-ngo?retryWrites=true&w=majority

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-production-secret-key-change-this-immediately

# Node Environment
NODE_ENV=development
```

## MongoDB Setup Options

### Option 1: Local MongoDB (Development)

1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/kaizen-ngo`

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Get connection string from Atlas dashboard
4. Whitelist your IP address
5. Create database user with password
6. Use connection string in `.env.local`

## Migration Steps

### 1. Backup Current Data

```bash
npm run backup
```

This will create a timestamped backup of all JSON files in `src/data/backups/`

### 2. Run Migration

```bash
npm run migrate
```

This will:
- Backup JSON files automatically
- Connect to MongoDB
- Create all collections
- Migrate all projects, blog posts, users, and settings
- Verify data integrity

### 3. Verify Migration

Check the console output for:
- ✅ Projects migrated count
- ✅ Blog posts migrated count
- ✅ Admin user created
- ✅ Settings created

## Rollback Plan

If anything goes wrong:

1. Your original JSON files are backed up in `src/data/backups/[timestamp]/`
2. The original files in `src/data/` are NOT modified during migration
3. You can continue using the file-based system if needed

## Testing

After migration, test:

1. **Public Website**
   - Homepage displays projects
   - Projects page shows all Erasmus projects
   - Individual project pages load

2. **Admin Panel**
   - Login with existing credentials
   - Dashboard shows statistics
   - Create new project
   - Edit existing project
   - Upload images

## Troubleshooting

### Connection Error

If you see "MongoDB connection error":
- Check if MongoDB is running (local)
- Verify connection string in `.env.local`
- Check network/firewall settings
- For Atlas: verify IP whitelist

### Migration Fails

- Check console for specific error
- Verify JSON files are valid
- Check MongoDB has enough storage
- Restore from backup if needed

## Next Steps

After successful migration:

1. Test all functionality thoroughly
2. Monitor database performance
3. Set up automated backups
4. Update deployment configuration
5. Consider removing JSON files after 1 week of stable operation

## Support

For issues, check:
- MongoDB connection string format
- Environment variables are set correctly
- MongoDB service is running
- Sufficient disk space available
