import React from 'react';
import { Exercise } from '../types';

interface InstructionScreenProps {
  exercise: Exercise;
  onStartWorkout: () => void;
}

export const InstructionScreen: React.FC<InstructionScreenProps> = ({ exercise, onStartWorkout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">How to Perform: {exercise.name}</h1>
        <p className="mt-4 text-lg text-gray-300">
          Watch this short video to ensure you have the correct form before you begin.
        </p>
        
        <div className="mt-8 aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-700">
            <iframe 
                className="w-full h-full"
                src={exercise.instructionVideoUrl}
                title={`Instructional video for ${exercise.name}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </div>

        <button
          onClick={onStartWorkout}
          className="mt-10 w-full max-w-md bg-green-600 hover:bg-green-700 text-white text-2xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          I'm Ready, Start Workout!
        </button>
      </div>
    </div>
  );
};
