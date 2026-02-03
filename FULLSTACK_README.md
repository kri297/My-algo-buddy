# 🚀 AlgoBuddy - Complete Full-Stack DSA Learning Platform

A modern, full-stack web application for learning Data Structures and Algorithms with interactive visualizations, user authentication, progress tracking, and gamification.

## ✨ Features

### Frontend
- 🎨 **Algorithm Visualizer** - 7 sorting algorithms with step-by-step animations
- 🏗️ **Data Structure Simulator** - 6 interactive data structures
- 🌙 **Dark Mode** support
- 📱 **Responsive Design** for all devices
- 🎮 **Interactive Controls** - Speed adjustment, sound effects, keyboard shortcuts
- 💻 **Code Editor** with syntax highlighting

### Backend
- 🔐 **Authentication** - User signup/signin with NextAuth.js
- 📊 **Progress Tracking** - Track algorithms completed and time spent
- 🏆 **Achievements System** - Earn badges and unlock rewards
- 📈 **Leaderboard** - Compete with other users
- 💾 **Save/Load Sessions** - Save your work and continue later
- 🎯 **XP & Leveling System** - Gain experience and level up

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **Database**: MongoDB (local or MongoDB Atlas)
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### 1. Clone and Install Dependencies

\`\`\`bash
cd algo-buddy
npm install
\`\`\`

### 2. Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   \`\`\`bash
   mongod
   \`\`\`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Replace in `.env.local`

### 3. Configure Environment Variables

The `.env.local` file is already created. Update these values:

\`\`\`env
# Database - Update if using MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/algobuddy

# Change this to a secure random string
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# No need to change
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Important**: Generate a secure NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Getting Started
1. **Sign Up**: Create account at `/auth/signup`
2. **Sign In**: Login at `/auth/signin`
3. **Dashboard**: View your progress at `/dashboard`
4. **Start Learning**: Go to `/visualize`

### Features Guide

#### Algorithm Visualizer
- Select sorting algorithm from dropdown
- Choose input mode (Random/Custom)
- Adjust animation speed
- Watch step-by-step animations
- Track variables and code execution

#### Data Structures
- **Stack**: Push, Pop, Peek operations
- **Queue**: Enqueue, Dequeue
- **Linked List**: Insert/Delete at any position
- **Double Linked List**: Bidirectional operations
- **BST**: Insert, Search, Traversals with animations
- **Graph**: Add nodes/edges, DFS, BFS, cycle detection

#### Progression System
- Earn **50 XP** for completing a new algorithm
- Earn **40 XP** for mastering a new data structure
- Level up every **100 XP**
- Unlock achievements for milestones
- Climb the leaderboard

## 📁 Project Structure

\`\`\`
algo-buddy/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   │   ├── auth/         # Authentication
│   │   │   ├── users/        # User management
│   │   │   ├── progress/     # Progress tracking
│   │   │   ├── achievements/ # Achievements
│   │   │   ├── leaderboard/  # Leaderboard
│   │   │   └── sessions/     # Save/Load
│   │   ├── auth/             # Auth pages
│   │   ├── dashboard/        # User dashboard
│   │   └── visualize/        # Main visualizer
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── mongodb.ts        # Database connection
│   │   └── auth.ts           # Auth configuration
│   ├── models/               # MongoDB schemas
│   └── types/                # TypeScript types
├── .env.local                # Environment variables
└── package.json
\`\`\`

## 🔌 API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Progress
- `POST /api/progress` - Update progress
- `GET /api/progress?userId=...` - Get user progress

### Achievements
- `GET /api/achievements?userId=...` - Get user achievements

### Leaderboard
- `GET /api/leaderboard?limit=100` - Get top users

### Sessions
- `POST /api/sessions` - Save session
- `GET /api/sessions?userId=...` - Get saved sessions
- `DELETE /api/sessions?sessionId=...` - Delete session

## 🏆 Achievements

| Achievement | Condition | XP Bonus |
|------------|-----------|----------|
| 🎯 First Steps | Complete 1 algorithm | 10 |
| 🏆 Algorithm Master | Complete all 7 algorithms | 100 |
| 🏗️ Structure Builder | Master 1 data structure | 10 |
| 🌟 DS Expert | Master all 6 structures | 100 |
| ⚡ Speed Demon | 60 min learning time | 50 |
| 📈 Level 5 | Reach Level 5 | 25 |
| 🚀 Level 10 | Reach Level 10 | 50 |
| 👑 Level 20 | Reach Level 20 | 100 |

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

\`\`\`bash
git add .
git commit -m "Complete full-stack AlgoBuddy"
git push origin main
\`\`\`

### MongoDB Atlas Setup
1. Whitelist Vercel IPs (or use 0.0.0.0/0 for development)
2. Update `MONGODB_URI` in Vercel environment variables

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- For Atlas: Verify IP whitelist and credentials

### NextAuth Error
- Generate new `NEXTAUTH_SECRET`
- Verify `NEXTAUTH_URL` matches your domain

### Build Errors
\`\`\`bash
rm -rf .next node_modules
npm install
npm run dev
\`\`\`

## 📝 License

MIT License - feel free to use for learning and projects!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 👨‍💻 Author

Built with ❤️ for students learning DSA

---

**Happy Learning! 🎓**
