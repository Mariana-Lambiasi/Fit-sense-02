import React from 'react';
import { User, WorkoutPlan } from '../types';

interface WorkoutPlanScreenProps {
  user: User;
  plan: WorkoutPlan;
  onContinue: () => void;
}

export const WorkoutPlanScreen: React.FC<WorkoutPlanScreenProps> = ({ user, plan, onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-cyan-400">Bem-vindo(a), {user.name}!</h1>
          <p className="mt-4 text-xl text-gray-300">
            Seu plano de treino personalizado por IA está pronto.
          </p>
        </header>

        <main className="bg-gray-800 p-8 rounded-xl shadow-2xl">
            <div className="text-center border-b border-gray-700 pb-4 mb-6">
                <h2 className="text-3xl font-semibold text-white">{plan.title}</h2>
                <p className="text-gray-400 mt-2">{plan.description}</p>
            </div>
          
          <div className="space-y-6">
            {plan.workouts.map((workout) => (
              <div key={workout.day} className="bg-gray-700 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-cyan-400">DIA {workout.day}</p>
                        <h3 className="text-2xl font-bold text-white">{workout.title}</h3>
                    </div>
                    <p className="text-gray-300 bg-gray-600 px-3 py-1 rounded-full text-sm">{workout.focus}</p>
                </div>
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-300">
                  {workout.exercises.map((ex) => (
                    <li key={ex.name}>
                      <span className="font-semibold text-white">{ex.name}:</span> {ex.sets} séries de {ex.reps} repetições
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        
        <div className="mt-10 text-center">
            <button
                onClick={onContinue}
                className="w-full max-w-md bg-cyan-500 hover:bg-cyan-600 text-white text-xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                Vamos Lá!
            </button>
        </div>
      </div>
    </div>
  );
};