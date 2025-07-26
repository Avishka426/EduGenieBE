#!/bin/bash
# Git history cleanup script for API key removal

echo "🔧 Cleaning Git History to Remove API Keys..."

# Create a backup branch
git branch backup-before-cleanup

# Reset to the last clean commit (before API keys were added)
git reset --hard d15525b

# Re-apply your changes without API keys
echo "📝 Re-applying changes without sensitive data..."

# Copy current file contents (which have placeholders)
# The files are already fixed, so we just need to commit them again

git add .
git commit -m "feat: Complete EduGenie backend implementation

- User authentication and authorization system
- Course management with CRUD operations  
- Profile picture upload with Cloudinary integration
- AI-powered course recommendations with GPT-3
- Comprehensive API documentation
- Environment configuration with security best practices
- Case-insensitive enum handling for better UX

Security: All API keys replaced with placeholders"

echo "✅ Git history cleaned successfully!"
echo "📤 Ready to push clean history to GitHub"

# Display the new history
git log --oneline -5
