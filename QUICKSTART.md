# 🚀 QUICK START GUIDE

## Get Up and Running in 5 Minutes!

### Step 1: Install MongoDB (if not installed)

#### Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB will start automatically

#### Mac (with Homebrew):
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

#### Linux:
\`\`\`bash
sudo apt-get install mongodb
sudo systemctl start mongodb
\`\`\`

### Step 2: Configure Environment

The `.env.local` file is already created. Just update the secret:

\`\`\`bash
# Generate a secure secret
openssl rand -base64 32
\`\`\`

Copy the output and update `NEXTAUTH_SECRET` in `.env.local`

### Step 3: Start the App

\`\`\`bash
npm run dev
\`\`\`

### Step 4: Create Your Account

1. Open http://localhost:3000
2. Click "Sign Up" (or go to http://localhost:3000/auth/signup)
3. Create your account
4. Sign in and start learning!

## 🎯 What You Get

### ✅ Complete Features
- **7 Sorting Algorithms** with animations
- **6 Data Structures** with interactive operations
- **User Authentication** (signup/signin)
- **Progress Tracking** (XP, levels, ranks)
- **8 Achievements** to unlock
- **Leaderboard** to compete
- **Save/Load** your work
- **Dark Mode** support

### 📊 Database Collections
MongoDB will auto-create these collections:
- `users` - User accounts
- `progresses` - Learning progress
- `achievements` - Earned badges
- `leaderboards` - Rankings
- `sessions` - Saved work

## 🔧 Troubleshooting

### "MongoDB connection error"
**Solution**: Make sure MongoDB is running
\`\`\`bash
# Windows: Check Services
# Mac/Linux:
sudo systemctl status mongodb
\`\`\`

### "NextAuth error"
**Solution**: Set NEXTAUTH_SECRET in `.env.local`
\`\`\`bash
openssl rand -base64 32
\`\`\`

### Port 3000 already in use
**Solution**: Kill the process or use different port
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\`\`\`

## 🌐 Using MongoDB Atlas (Cloud Database)

Don't want to install MongoDB locally? Use cloud:

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Update `.env.local`:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algobuddy
   \`\`\`

## 🎮 Testing Features

### Test User Journey
1. Sign up at `/auth/signup`
2. Sign in at `/auth/signin`
3. View dashboard at `/dashboard`
4. Complete an algorithm at `/visualize`
5. Watch your XP grow!
6. Earn your first achievement 🏆

### Test Progress Tracking
- Complete Bubble Sort → Earn 50 XP
- Complete Stack operations → Earn 40 XP
- Reach Level 2 → Unlock "Intermediate Coder"
- Complete all algorithms → Earn "Algorithm Master" badge

## 📱 Access Points

- **Home**: http://localhost:3000
- **Sign Up**: http://localhost:3000/auth/signup
- **Sign In**: http://localhost:3000/auth/signin
- **Dashboard**: http://localhost:3000/dashboard
- **Visualizer**: http://localhost:3000/visualize
- **API Health**: http://localhost:3000/api/users

## 🎉 You're Ready!

Your full-stack DSA learning platform is now running with:
- ✅ User authentication
- ✅ Progress tracking  
- ✅ Achievements
- ✅ Leaderboard
- ✅ Save/Load
- ✅ Complete frontend

**Start learning and have fun! 🚀**
