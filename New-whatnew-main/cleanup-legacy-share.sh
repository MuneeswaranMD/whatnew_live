#!/usr/bin/env bash

# Cleanup script for legacy share directories
# Run this after confirming the unified share system is working

echo "🧹 Cleaning up legacy share directories..."

# Check if directories exist before attempting to remove
if [ -d "share-page" ]; then
    echo "📁 Removing share-page directory..."
    rm -rf share-page
    echo "✅ share-page directory removed"
else
    echo "ℹ️  share-page directory does not exist"
fi

if [ -d "share-redirect" ]; then
    echo "📁 Removing share-redirect directory..."
    rm -rf share-redirect
    echo "✅ share-redirect directory removed"
else
    echo "ℹ️  share-redirect directory does not exist"
fi

echo "🎉 Legacy cleanup completed!"
echo ""
echo "📋 Current share system status:"
echo "✅ Unified share handler: /share"
echo "✅ Backend template: backend/templates/share/index.html"
echo "✅ Legacy URL redirects: Configured in backend/core/share_views.py"
echo "✅ Well-known files: .well-known/assetlinks.json, .well-known/apple-app-site-association"
echo ""
echo "🔗 Test your setup:"
echo "   https://app.addagram.in/share?ref=TEST123"
echo "   https://app.addagram.in/share?product=123"
echo "   https://app.addagram.in/share?livestream=123"
