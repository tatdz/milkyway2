#!/bin/bash

# Milkyway2 Fly.io Deployment Script
# This script automates the deployment process to Fly.io

set -e

echo "🚀 Starting Milkyway2 deployment to Fly.io..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI is not installed. Please install it first:"
    echo "   macOS: brew install flyctl"
    echo "   Linux: curl -L https://fly.io/install.sh | sh"
    echo "   Windows: powershell -Command \"iwr https://fly.io/install.ps1 -useb | iex\""
    exit 1
fi

# Check if user is authenticated
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not authenticated with Fly.io. Please run: fly auth login"
    exit 1
fi

# Check if app exists
if ! fly apps list | grep -q "milkyway2"; then
    echo "📱 Creating new Fly app: milkyway2"
    fly apps create milkyway2 --org personal
else
    echo "✅ App 'milkyway2' already exists"
fi

# Check if database URL is set
if ! fly secrets list | grep -q "DATABASE_URL"; then
    echo "⚠️  DATABASE_URL not set. Please set it with:"
    echo "   fly secrets set DATABASE_URL=\"your_postgresql_connection_string\""
    echo ""
    echo "💡 You can create a Fly Postgres database with:"
    echo "   fly postgres create --name milkyway2-db --region iad"
    echo "   fly postgres attach --app milkyway2-db milkyway2"
    echo ""
    read -p "Continue without database? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ DATABASE_URL is configured"
fi

# Set default secrets if not already set
if ! fly secrets list | grep -q "PASSET_RPC_URL"; then
    echo "🔗 Setting PASSET_RPC_URL"
    fly secrets set PASSET_RPC_URL="https://rpc.passet.network"
fi

# Build and deploy
echo "🔨 Building and deploying the application..."
fly deploy

# Check deployment status
echo "📊 Checking deployment status..."
fly status

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Your app should be available at: https://milkyway2.fly.dev"
echo ""
echo "📝 Useful commands:"
echo "   fly logs          # View application logs"
echo "   fly status        # Check app status"
echo "   fly open          # Open the app in browser"
echo "   fly ssh console   # Connect to app console"
echo ""
echo "🔧 To run database migrations:"
echo "   fly ssh console"
echo "   npm run db:push" 