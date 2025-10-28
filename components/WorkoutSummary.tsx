import React from 'react';
import { useState, useEffect } from 'react';
import { WorkoutSummaryData } from '../types';
import { getAIWorkoutSummary } from '../services/geminiService';

interface WorkoutSummaryProps {
  summary: WorkoutSummaryData;
  onNewWorkout: () => void;
}

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryProps> = ({ summary, onNewWorkout }) => {
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      const suggestion = await getAIWorkoutSummary(summary.exercise, summary.corrections);
      setAiSuggestion(suggestion);
      setIsLoading(false);
    };
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  const MetricCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`font-bold text-3xl ${className}`}>{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-cyan-400">Great Job!</h1>
            <p className="mt-2 text-xl text-gray-300">
            Performance Report for {summary.exercise.name}
            </p>
        </div>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="SETS" value={summary.sets} />
            <MetricCard label="REPS" value={summary.reps} />
            <MetricCard label="FORM SCORE" value={`${summary.formScore}%`} className="text-green-400" />
            <MetricCard label="CORRECTIONS" value={summary.corrections} className="text-yellow-400" />
        </div>

        <div className="mt-8 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-cyan-400 mb-3">AI Coach Tip</h2>
            {isLoading ? (
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-6 h-6 border-2 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                    <p>Generating personalized feedback...</p>
                </div>
            ) : (
                <p className="text-lg text-gray-200">{aiSuggestion}</p>
            )}
        </div>

        <button
          onClick={onNewWorkout}
          className="mt-10 w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Start New Exercise
        </button>
      </div>
    </div>
  );
};
