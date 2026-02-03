import mongoose, { Schema, model, models } from 'mongoose';

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  rank: { type: String, default: 'Beginner' },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

// Progress Schema
const progressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  algorithmsCompleted: [{
    algorithmId: String,
    completedAt: Date,
    timeSpent: Number,
    bestTime: Number,
  }],
  dataStructuresMastered: [{
    structureId: String,
    operationsCompleted: Number,
    masteredAt: Date,
  }],
  totalAlgorithmsCompleted: { type: Number, default: 0 },
  totalDataStructuresCompleted: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
  // Learning-specific fields
  lessonsCompleted: [{ type: String }],
  lessonsStarted: [{ type: String }],
  lessonsProgress: { type: Map, of: Schema.Types.Mixed },
  lastActiveLesson: { type: String },
  totalXP: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  // Practice problems tracking
  problemsSolved: [{
    problemId: String,
    completedAt: Date,
    difficulty: String,
  }],
  // Quiz tracking
  quizzesCompleted: [{
    quizId: String,
    score: Number,
    totalQuestions: Number,
    xpEarned: Number,
    completedAt: Date,
  }],
  totalQuizzesCompleted: { type: Number, default: 0 },
  // Flashcard tracking
  flashcardsLearned: [{
    cardId: Number,
    category: String,
    learnedAt: Date,
  }],
  flashcardStreak: { type: Number, default: 0 },
  // Speed coding tracking
  speedChallengesCompleted: [{
    challengeId: Number,
    timeSpent: Number,
    pointsEarned: Number,
    completedAt: Date,
  }],
  totalSpeedCodingPoints: { type: Number, default: 0 },
  // Visualizer tracking
  visualizationsCompleted: [{
    algorithmId: String,
    completedAt: Date,
  }],
  updatedAt: { type: Date, default: Date.now },
});

// Achievement Schema
const achievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
});

// Leaderboard Entry Schema
const leaderboardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  totalXP: { type: Number, default: 0 },
  algorithmsCompleted: { type: Number, default: 0 },
  dataStructuresCompleted: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

// Saved Session Schema (for saving algorithm/DS states)
const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['algorithm', 'datastructure'], required: true },
  name: { type: String, required: true },
  state: { type: Schema.Types.Mixed, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = models.User || model('User', userSchema);
export const Progress = models.Progress || model('Progress', progressSchema);
export const Achievement = models.Achievement || model('Achievement', achievementSchema);
export const Leaderboard = models.Leaderboard || model('Leaderboard', leaderboardSchema);
export const Session = models.Session || model('Session', sessionSchema);
