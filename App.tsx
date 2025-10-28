import React from 'react';
import { useState, useCallback } from 'react';
import { AppState, User, Exercise, WorkoutSummaryData, RegistrationData, WorkoutPlan } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { WorkoutPlanScreen } from './components/WorkoutPlanScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { InstructionScreen } from './components/InstructionScreen';
import { WorkoutScreen } from './components/WorkoutScreen';
import { WorkoutSummaryScreen } from './components/WorkoutSummary';
import { generateProgressiveWorkoutPlan } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Welcome);
  const [user, setUser] = useState<User | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummaryData | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [planUpdateNeeded, setPlanUpdateNeeded] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleIdentified = useCallback((identifiedUser: User) => {
    setUser(identifiedUser);
    // Simulate that a returning user has some saved registration data
    // In a real app, this would be fetched from a database
    if (!registrationData) {
        setRegistrationData({
            name: identifiedUser.name,
            age: 30, height: 180, weight: 80,
            healthNotes: 'None',
            goals: 'Build muscle and increase strength',
            focusAreas: 'Chest and back'
        });
    }
    setPlanUpdateNeeded(Math.random() < 0.4); // 40% chance of needing an update
    setAppState(AppState.Dashboard);
  }, [registrationData]);

  const handleStartRegistration = useCallback(() => {
    setAppState(AppState.Register);
  }, []);

  const handleCompleteRegistration = useCallback((regData: RegistrationData, plan: WorkoutPlan) => {
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: regData.name,
        avatarUrl: `https://picsum.photos/seed/${regData.name}/200`,
    };
    setUser(newUser);
    setRegistrationData(regData);
    setWorkoutPlan(plan);
    setAppState(AppState.WorkoutPlan);
  }, []);

  const handleShowDashboard = useCallback(() => {
    setAppState(AppState.Dashboard);
  }, []);

  const handleSelectExercise = useCallback((exercise: Exercise) => {
    setCurrentExercise(exercise);
    setAppState(AppState.Instructions);
  }, []);

  const handleStartWorkout = useCallback(() => {
    if (currentExercise) {
      setAppState(AppState.Workout);
    }
  }, [currentExercise]);
  
  const handleFinishWorkout = useCallback((summary: WorkoutSummaryData) => {
    setWorkoutSummary(summary);
    setAppState(AppState.Summary);
  }, []);

  const handleNewWorkout = useCallback(() => {
    setCurrentExercise(null);
    setWorkoutSummary(null);
    setAppState(AppState.Dashboard);
  }, []);

  const handleRequestNewPlan = useCallback(async () => {
    if (!registrationData || isGeneratingPlan) return;
    setIsGeneratingPlan(true);
    setPlanUpdateNeeded(false);
    
    const newPlan = await generateProgressiveWorkoutPlan(registrationData);
    
    setWorkoutPlan(newPlan);
    setAppState(AppState.WorkoutPlan);
    setIsGeneratingPlan(false);
  }, [registrationData, isGeneratingPlan]);

  const handleDismissUpdateAlert = useCallback(() => {
    setPlanUpdateNeeded(false);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.Welcome:
        return <WelcomeScreen onIdentified={handleIdentified} onStartRegistration={handleStartRegistration} />;
      case AppState.Register:
        return <RegistrationScreen onComplete={handleCompleteRegistration} />;
      case AppState.WorkoutPlan:
        if (user && workoutPlan) {
            return <WorkoutPlanScreen user={user} plan={workoutPlan} onContinue={handleShowDashboard} />;
        }
        setAppState(AppState.Welcome);
        return null;
      case AppState.Dashboard:
        if (user) {
          return <DashboardScreen 
                    user={user} 
                    onSelectExercise={handleSelectExercise} 
                    planUpdateNeeded={planUpdateNeeded}
                    isGenerating={isGeneratingPlan}
                    onRequestNewPlan={handleRequestNewPlan}
                    onDismissUpdateAlert={handleDismissUpdateAlert}
                 />;
        }
        setAppState(AppState.Welcome);
        return null;
      case AppState.Instructions:
        if (currentExercise) {
          return <InstructionScreen exercise={currentExercise} onStartWorkout={handleStartWorkout} />;
        }
        setAppState(AppState.Dashboard);
        return null;
      case AppState.Workout:
        if (currentExercise) {
          return <WorkoutScreen exercise={currentExercise} onFinishWorkout={handleFinishWorkout} />;
        }
        setAppState(AppState.Dashboard);
        return null;
      case AppState.Summary:
        if (workoutSummary) {
          return <WorkoutSummaryScreen summary={workoutSummary} onNewWorkout={handleNewWorkout} />;
        }
        setAppState(AppState.Dashboard);
        return null;
      default:
        setAppState(AppState.Welcome);
        return null;
    }
  };

  return <div className="bg-gray-900 min-h-screen">{renderContent()}</div>;
};

export default App;