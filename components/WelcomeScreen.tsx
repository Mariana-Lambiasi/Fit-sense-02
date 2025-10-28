import React from 'react';
import { useState, useRef } from 'react';
import { User } from '../types';
import { useCamera } from '../hooks/useCamera';

interface WelcomeScreenProps {
  onIdentified: (user: User) => void;
  onStartRegistration: () => void;
  onLogin: (email: string, pass: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onIdentified, onStartRegistration, onLogin }) => {
  const [mode, setMode] = useState<'welcome' | 'login'>('welcome');
  const [isScanning, setIsScanning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { error } = useCamera(videoRef, mode === 'welcome');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-123',
        name: 'Alex',
        avatarUrl: `https://picsum.photos/seed/alex/200`,
      };
      onIdentified(mockUser);
    }, 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        onLogin(email, password);
        setIsLoading(false);
    }, 1500);
  };
  
  if (mode === 'login') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Entrar na sua conta</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400" 
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400" 
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !email || !password}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={onStartRegistration} className="text-cyan-400 hover:underline">
                        Não tem conta? Cadastre-se
                    </button>
                </div>
                 <div className="mt-4 text-center">
                    <button onClick={() => setMode('welcome')} className="text-gray-400 hover:underline text-sm">
                        🔙 Voltar para a tela inicial
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-cyan-400">Bem-vindo à FitSense</h1>
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
            className="w-full h-full object-cover scale-x-[-1]"
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
          {isScanning ? 'Identificando...' : 'Entrar com Reconhecimento Facial'}
        </button>
         <button
          onClick={() => setMode('login')}
          disabled={isScanning}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Entrar com E-mail e Senha
        </button>
         <button
          onClick={onStartRegistration}
          disabled={isScanning}
          className="w-full bg-transparent hover:bg-gray-700 text-cyan-400 text-lg font-semibold py-3 px-6 rounded-lg border border-cyan-400"
        >
          Primeira vez aqui? Cadastre-se
        </button>
      </div>
    </div>
  );
};