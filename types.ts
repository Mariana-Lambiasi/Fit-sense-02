export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  lastWeightKg: number;
  muscleGroupImageUrl: string;
  muscleHighlightImageUrl: string;
  instructionVideoUrl: string;
  mockLiveFeedback: Omit<LiveFeedback, 'id'>[];
}

export enum AppState {
  Welcome,
  Register,
  WorkoutPlan,
  Dashboard,
  Instructions,
  Workout,
  Summary,
}

export interface WorkoutSummaryData {
  exercise: Exercise;
  sets: number;
  reps: number;
  formScore: number;
  corrections: number;
}

export type LiveFeedbackType = 'correction' | 'encouragement';

export interface LiveFeedback {
    id: number;
    message: string;
    type: LiveFeedbackType;
}

export interface RegistrationData {
    name: string;
    age: number;
    height: number;
    weight: number;
    email: string;
    healthNotes: string;
    goals: string;
    focusAreas: string;
}

export interface PlanExercise {
    name: string;
    sets: string;
    reps: string;
}

export interface DailyWorkout {
    day: number;
    title: string;
    focus: string;
    exercises: PlanExercise[];
}

export interface WorkoutPlan {
    title: string;
    description: string;
    workouts: DailyWorkout[];
}