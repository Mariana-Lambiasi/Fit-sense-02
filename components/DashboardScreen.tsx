
import React from 'react';
import { User, Exercise } from '../types';

interface DashboardScreenProps {
  user: User;
  onSelectExercise: (exercise: Exercise) => void;
  planUpdateNeeded: boolean;
  isGenerating: boolean;
  onRequestNewPlan: () => void;
  onDismissUpdateAlert: () => void;
}

// Mock data for exercises available on the current machine
const MOCK_EXERCISES: Exercise[] = [
  { 
    id: 'ex-01', 
    name: 'Bicep Curls', 
    description: 'Isolates the biceps.', 
    lastWeightKg: 10,
    muscleGroupImageUrl: 'https://i.imgur.com/A65A55M.png',
    muscleHighlightImageUrl: 'https://i.imgur.com/G2x2Ym4.png',
    instructionVideoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo?autoplay=1&mute=1&controls=0&loop=1&playlist=ykJmrZ5v0Oo',
    mockLiveFeedback: [
        { message: 'Keep your elbows locked to your sides.', type: 'correction' },
        { message: 'Nice and controlled movement!', type: 'encouragement' },
        { message: 'Avoid using momentum to lift the weight.', type: 'correction' },
        { message: 'Great job isolating the bicep.', type: 'encouragement' },
        { message: 'Lower the weight slowly.', type: 'correction' },
    ]
  },
  { 
    id: 'ex-02', 
    name: 'Tricep Pushdowns', 
    description: 'Targets the triceps.', 
    lastWeightKg: 25,
    muscleGroupImageUrl: 'https://i.imgur.com/A65A55M.png',
    muscleHighlightImageUrl: 'https://i.imgur.com/dhtop7s.png',
    instructionVideoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU?autoplay=1&mute=1&controls=0&loop=1&playlist=2-LAMcpzODU',
    mockLiveFeedback: [
        { message: 'Keep your shoulders down and back.', type: 'correction' },
        { message: 'Excellent control!', type: 'encouragement' },
        { message: 'Fully extend your arms at the bottom.', type: 'correction' },
        { message: 'Solid form.', type: 'encouragement' },
    ]
  },
  { 
    id: 'ex-03', 
    name: 'Shoulder Press', 
    description: 'Works the deltoids and triceps.', 
    lastWeightKg: 20,
    muscleGroupImageUrl: 'https://i.imgur.com/A65A55M.png',
    muscleHighlightImageUrl: 'https://i.imgur.com/EKFz8s4.png',
    instructionVideoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog?autoplay=1&mute=1&controls=0&loop=1&playlist=qEwKCR5JCog',
    mockLiveFeedback: [
        { message: 'Don\'t arch your back.', type: 'correction' },
        { message: 'Powerful press!', type: 'encouragement' },
        { message: 'Control the weight on the way down.', type: 'correction' },
        { message: 'Great range of motion.', type: 'encouragement' },
    ]
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onSelectExercise, planUpdateNeeded, isGenerating, onRequestNewPlan, onDismissUpdateAlert }) => {
  
  const UpdateBanner = () => (
    <div className="bg-cyan-900/80 border-2 border-cyan-500 p-6 rounded-xl mb-10 text-center shadow-lg animate-pulse">
        <h2 className="text-2xl font-bold text-white">AI Coach Recommendation</h2>
        <p className="text-gray-300 mt-2">You're making great progress! It's time for a new challenge to keep pushing your limits.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button onClick={onRequestNewPlan} disabled={isGenerating} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg">
                {isGenerating ? 'Generating...' : 'Generate New Plan'}
            </button>
            <button onClick={onDismissUpdateAlert} disabled={isGenerating} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                Maybe Later
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-5xl">
        <header className="flex items-center space-x-4 mb-10">
          <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-cyan-400" />
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-lg text-gray-400">Ready to crush your goals today?</p>
          </div>
        </header>

        {planUpdateNeeded && <UpdateBanner />}

        <main className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-cyan-400 border-b-2 border-gray-700 pb-2">
            Select Your Exercise For This Machine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_EXERCISES.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onSelectExercise(exercise)}
                className="group bg-gray-700 rounded-lg text-left hover:bg-cyan-900/50 shadow-lg transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-500 flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                    <img src={exercise.muscleGroupImageUrl} alt="Human body outline" className="w-full h-full object-contain"/>
                    <img src={exercise.muscleHighlightImageUrl} alt={`${exercise.name} muscle highlight`} className="w-full h-full object-contain absolute top-0 left-0 opacity-80 group-hover:opacity-100 transition-opacity"/>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-white">{exercise.name}</h3>
                    <p className="text-gray-300 mt-2 flex-grow">{exercise.description}</p>
                    <p className="text-sm text-gray-400 mt-4">Last Weight: {exercise.lastWeightKg} kg</p>
                </div>
              </button>
            ))}
          </div>
        </main>
        
        <footer className="mt-10 bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl font-semibold text-cyan-400">Workout Plan Management</h2>
          <p className="text-gray-400 mt-2">Ready for a new routine? Let our AI generate an updated plan for you.</p>
          <button onClick={onRequestNewPlan} disabled={isGenerating} className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white text-lg font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
              {isGenerating ? (
                  <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-white border-gray-400 rounded-full animate-spin mr-2"></div>
                      Generating...
                  </span>
              ) : 'Request New Workout Plan'}
          </button>
        </footer>
      </div>
    </div>
  );
};