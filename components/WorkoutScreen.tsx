import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Exercise, WorkoutSummaryData, LiveFeedback, LiveFeedbackType } from '../types';
import { useCamera } from '../hooks/useCamera';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';

interface WorkoutScreenProps {
  exercise: Exercise;
  onFinishWorkout: (summary: WorkoutSummaryData) => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ exercise, onFinishWorkout }) => {
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [heartRate, setHeartRate] = useState(110);
  const [formScore, setFormScore] = useState(95);
  const [liveFeedbackLog, setLiveFeedbackLog] = useState<LiveFeedback[]>([]);
  const [correctionsCount, setCorrectionsCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { error } = useCamera(videoRef, true);

  // Simulate rep counting
  useEffect(() => {
    const repInterval = setInterval(() => {
        setReps(r => {
            if (r + 1 > 10) {
                setSets(s => s + 1);
                return 1;
            }
            return r + 1;
        });
    }, 2500); // One rep every 2.5 seconds
    
    return () => clearInterval(repInterval);
  }, []);

  // Simulate live data (HR, Form Score, Feedback)
  useEffect(() => {
    const dataInterval = setInterval(() => {
      // Simulate HR fluctuation
      setHeartRate(hr => hr + Math.floor(Math.random() * 5) - 2);

      // Simulate new feedback every 4s from exercise-specific feedback
       const newFeedbackItem = exercise.mockLiveFeedback[Math.floor(Math.random() * exercise.mockLiveFeedback.length)];
       const newFeedback: LiveFeedback = { ...newFeedbackItem, id: Date.now() };

       if (newFeedback.type === 'correction') {
           setCorrectionsCount(c => c + 1);
           setFormScore(s => Math.max(70, s - Math.floor(Math.random() * 3) - 1));
       } else {
           setFormScore(s => Math.min(100, s + 1));
       }

       setLiveFeedbackLog(prev => [newFeedback, ...prev].slice(0, 5)); // Keep last 5 messages

    }, 4000);

    return () => clearInterval(dataInterval);
  }, [exercise.mockLiveFeedback]);


  const handleFinish = () => {
    const summary: WorkoutSummaryData = {
        exercise,
        sets: sets,
        reps,
        formScore: formScore,
        corrections: correctionsCount,
    };
    onFinishWorkout(summary);
  };
  
  const FeedbackItem: React.FC<{feedback: LiveFeedback}> = ({ feedback }) => {
    const isCorrection = feedback.type === 'correction';
    const bgColor = isCorrection ? 'bg-yellow-900/50' : 'bg-green-900/50';
    const borderColor = isCorrection ? 'border-yellow-500' : 'border-green-500';
    const textColor = isCorrection ? 'text-yellow-300' : 'text-green-300';
    const Icon = isCorrection ? WarningIcon : CheckIcon;

    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
            <p className="text-md">{feedback.message}</p>
        </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-900 text-white p-4 gap-8">
      {/* Left side: Camera Feed */}
      <div className="w-full lg:w-2/3 h-[50vh] lg:h-[80vh] bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-700 shadow-lg relative">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-400 p-4">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
        )}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-3 rounded-lg">
            <h2 className="text-3xl font-bold text-cyan-400">{exercise.name}</h2>
        </div>
      </div>

      {/* Right side: Controls and Feedback */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-lg">SETS</p>
                <p className="text-5xl font-bold">{sets}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-lg">REPS</p>
                <p className="text-5xl font-bold">{reps}</p>
            </div>
        </div>
         <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">HEART RATE</p>
                <p className="text-3xl font-bold text-red-400">{heartRate} <span className="text-lg">BPM</span></p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">FORM SCORE</p>
                <p className="text-3xl font-bold text-green-400">{formScore}%</p>
            </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-400 mb-3 text-center border-b border-gray-700 pb-2">LIVE CORRECTIONS</h3>
            <div className="flex flex-col gap-3 overflow-hidden">
                {liveFeedbackLog.length > 0 ? (
                    liveFeedbackLog.map((fb) => <FeedbackItem key={fb.id} feedback={fb} />)
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        <p>Starting analysis...</p>
                    </div>
                )}
            </div>
        </div>
        
        <button
          onClick={handleFinish}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
};