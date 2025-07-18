# Milkyway2 Deployment Guide for Fly.io

This guide will walk you through deploying the Milkyway2 application to Fly.io.

## Prerequisites

1. **Fly CLI**: Install the Fly CLI
   ```bash
   # macOS
   brew install flyctl
   
   # Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Fly Account**: Sign up at [fly.io](https://fly.io) and authenticate
   ```bash
   fly auth login
   ```

3. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Fly Postgres)

## Step 1: Prepare Your Database

### Option A: Use Fly Postgres (Recommended)
```bash
# Create a Postgres app
fly postgres create --name milkyway2-db --region iad

# Attach it to your app
fly postgres attach --app milkyway2-db milkyway2
```

### Option B: Use Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string

### Option C: Use Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings > Database

## Step 2: Deploy the Application

1. **Clone and navigate to the project**
   ```bash
   git clone https://github.com/tatdz/milkyway2.git
   cd milkyway2
   ```

2. **Set up environment variables**
   ```bash
   # Set your database URL
   fly secrets set DATABASE_URL="your_postgresql_connection_string"
   
   # Set blockchain RPC URL
   fly secrets set PASSET_RPC_URL="https://rpc.passet.network"
   ```

3. **Deploy the application**
   ```bash
   fly deploy
   ```

## Step 3: Configure the Application

1. **Run database migrations** (if using a real database)
   ```bash
   # Connect to your deployed app
   fly ssh console
   
   # Run migrations
   npm run db:push
   ```

2. **Verify the deployment**
   ```bash
   fly status
   fly logs
   ```

## Step 4: Set Up Custom Domain (Optional)

1. **Add your domain**
   ```bash
   fly certs add yourdomain.com
   ```

2. **Configure DNS**
   - Add a CNAME record pointing to `milkyway2.fly.dev`

## Environment Variables

The following environment variables need to be configured:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `PASSET_RPC_URL` | Passet blockchain RPC endpoint | No | `https://rpc.passet.network` |
| `PORT` | Application port | No | `5001` |
| `NODE_ENV` | Environment mode | No | `production` |

## Troubleshooting

### Common Issues

1. **Build fails**
   ```bash
   # Check build logs
   fly logs
   
   # Ensure all dependencies are in package.json
   npm install
   ```

2. **Database connection issues**
   ```bash
   # Verify database URL
   fly secrets list
   
   # Test connection
   fly ssh console
   node -e "console.log(process.env.DATABASE_URL)"
   ```

3. **App not starting**
   ```bash
   # Check application logs
   fly logs
   
   # Connect to the app
   fly ssh console
   ```

### Useful Commands

```bash
# View app status
fly status

# View logs
fly logs

# Connect to app console
fly ssh console

# Scale the app
fly scale count 2

# View app info
fly info

# Open the app
fly open
```

## Monitoring and Maintenance

1. **Set up monitoring**
   ```bash
   # Enable metrics
   fly metrics enable
   ```

2. **Set up alerts**
   - Configure alerts in the Fly dashboard
   - Monitor error rates and response times

3. **Regular maintenance**
   ```bash
   # Update the app
   fly deploy
   
   # Check for updates
   fly status
   ```

## Security Considerations

1. **Environment variables**: Never commit secrets to your repository
2. **Database security**: Use connection pooling and SSL
3. **HTTPS**: Fly.io automatically provides SSL certificates
4. **Rate limiting**: Consider implementing rate limiting for API endpoints

## Cost Optimization

1. **Auto-scaling**: The app is configured to auto-stop when not in use
2. **Resource limits**: Monitor usage in the Fly dashboard
3. **Database optimization**: Use connection pooling and proper indexing

## Support

- **Fly.io Documentation**: [fly.io/docs](https://fly.io/docs)
- **Fly.io Community**: [community.fly.io](https://community.fly.io)
- **Project Issues**: [GitHub Issues](https://github.com/tatdz/milkyway2/issues)

---

Your Milkyway2 app should now be deployed and accessible at `https://milkyway2.fly.dev`! 