import React from 'react';
import { useState, useRef } from 'react';
import { User } from '../types';
import { useCamera } from '../hooks/useCamera';

interface WelcomeScreenProps {
  onIdentified: (user: User) => void;
  onStartRegistration: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onIdentified, onStartRegistration }) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { error } = useCamera(videoRef, true); // Camera is always enabled on this screen

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate successful identification of a returning user
      const mockUser: User = {
        id: 'user-123',
        name: 'Alex',
        avatarUrl: `https://picsum.photos/seed/alex/200`,
      };
      onIdentified(mockUser);
    }, 3000); // 3-second scan simulation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-cyan-400">Fitsense</h1>
        <p className="mt-4 text-xl text-gray-300">
          Aproxime-se da máquina para iniciar seu treino personalizado.
        </p>
      </div>

      <div className="mt-8 w-full max-w-md relative aspect-square bg-gray-800 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-400 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]" // Flip video horizontally
          />
        )}
         {isScanning && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold">Identificando...</p>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-md flex flex-col gap-4">
        <button
          onClick={handleScan}
          disabled={isScanning || !!error}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white text-xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
        >
          {isScanning ? 'Identificando...' : 'Escanear Meu Rosto para Começar'}
        </button>
         <button
          onClick={onStartRegistration}
          disabled={isScanning}
          className="w-full bg-transparent hover:bg-gray-700 text-cyan-400 text-lg font-semibold py-3 px-6 rounded-lg border border-cyan-400"
        >
          Primeira Vez Aqui? Cadastre-se
        </button>
      </div>
    </div>
  );
};