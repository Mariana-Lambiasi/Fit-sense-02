import React, { useState, useRef } from 'react';
import { RegistrationData, WorkoutPlan } from '../types';
import { useCamera } from '../hooks/useCamera';
import { generateWorkoutPlan } from '../services/geminiService';

interface RegistrationScreenProps {
  onComplete: (data: RegistrationData, plan: WorkoutPlan) => void;
}

type Step = 'personal' | 'health' | 'goals' | 'faceScan' | 'generating';

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    healthNotes: '',
    goals: '',
    focusAreas: '',
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { error } = useCamera(videoRef, step === 'faceScan');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'age' || name === 'height' || name === 'weight' ? parseInt(value, 10) || 0 : value
    }));
  };

  const nextStep = () => {
    if (step === 'personal') setStep('health');
    else if (step === 'health') setStep('goals');
    else if (step === 'goals') setStep('faceScan');
  };

  const prevStep = () => {
    if (step === 'health') setStep('personal');
    else if (step === 'goals') setStep('health');
    else if (step === 'faceScan') setStep('goals');
  };
  
  const handleEnroll = async () => {
    setIsEnrolling(true);
    // Simulate a 3-second facial data capture
    setTimeout(async () => {
        setStep('generating');
        const plan = await generateWorkoutPlan(formData);
        onComplete(formData, plan);
    }, 3000);
  };

  const renderStep = () => {
    switch (step) {
      case 'personal':
        return (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Fale-nos sobre você</h2>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Seu Nome" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" />
              <input type="number" name="age" placeholder="Idade" value={formData.age || ''} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" />
              <input type="number" name="height" placeholder="Altura (cm)" value={formData.height || ''} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" />
              <input type="number" name="weight" placeholder="Peso (kg)" value={formData.weight || ''} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" />
            </div>
          </div>
        );
      case 'health':
        return (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Informações de Saúde</h2>
            <p className="text-gray-400 mb-4">Por favor, liste quaisquer lesões ou condições de saúde que devamos conhecer. Se não houver, deixe em branco.</p>
            <textarea name="healthNotes" placeholder="Ex: Lesão anterior no joelho, dor lombar..." value={formData.healthNotes} onChange={handleChange} className="w-full h-40 p-3 bg-gray-700 rounded-lg text-white" />
          </div>
        );
      case 'goals':
        return (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Quais são seus objetivos?</h2>
            <div className="space-y-4">
              <textarea name="goals" placeholder="Qual é o seu principal objetivo de fitness? (ex: ganhar massa muscular, perder gordura, melhorar a resistência)" value={formData.goals} onChange={handleChange} className="w-full h-32 p-3 bg-gray-700 rounded-lg text-white" />
              <textarea name="focusAreas" placeholder="Alguma parte específica do corpo em que você queira focar? (ex: braços, pernas, abdômen)" value={formData.focusAreas} onChange={handleChange} className="w-full h-32 p-3 bg-gray-700 rounded-lg text-white" />
            </div>
          </div>
        );
      case 'faceScan':
        return (
             <div className="text-center">
                 <h2 className="text-3xl font-bold text-cyan-400 mb-4">Cadastro Facial</h2>
                 <p className="text-gray-400 mb-6">Centralize seu rosto no círculo para vincular seu perfil às nossas máquinas com segurança.</p>
                 <div className="w-full max-w-sm mx-auto relative aspect-square bg-gray-800 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg">
                    {error ? <p className="text-red-400 p-4">{error}</p> : <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />}
                    {isEnrolling && (
                         <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-lg font-semibold">Registrando...</p>
                        </div>
                    )}
                 </div>
             </div>
        );
      case 'generating':
        return (
             <div className="text-center">
                <div className="w-24 h-24 border-8 border-t-cyan-400 border-gray-600 rounded-full animate-spin mx-auto"></div>
                <h2 className="mt-8 text-3xl font-bold text-cyan-400">Criando Seu Plano...</h2>
                <p className="mt-4 text-gray-300">Nosso Coach de IA está criando um plano de treino personalizado só para você. Isso pode levar um momento.</p>
             </div>
        );
    }
  };

  const isNextDisabled = () => {
    if (step === 'personal') {
        return !formData.name || !formData.age || !formData.height || !formData.weight;
    }
    if (step === 'goals') {
        return !formData.goals || !formData.focusAreas;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl">
        {renderStep()}
        {step !== 'generating' && (
            <div className="mt-8 flex justify-between gap-4">
                {step !== 'personal' && (
                    <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">Voltar</button>
                )}
                {step !== 'faceScan' ? (
                    <button onClick={nextStep} disabled={isNextDisabled()} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg flex-grow">Próximo</button>
                ) : (
                    <button onClick={handleEnroll} disabled={isEnrolling || !!error} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg flex-grow">
                        {isEnrolling ? 'Salvando...' : 'Concluir Cadastro'}
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};