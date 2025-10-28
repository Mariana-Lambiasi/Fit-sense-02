import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, RegistrationData, WorkoutPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a personalized, actionable tip for the user after their workout.
 * @param exercise The exercise the user performed.
 * @param corrections The number of form corrections the user received.
 * @returns A promise that resolves to a string containing the AI-generated tip.
 */
export const getAIWorkoutSummary = async (exercise: Exercise, corrections: number): Promise<string> => {
    const prompt = `
        Aja como um personal trainer especialista em IA, fornecendo um resumo pós-treino.
        Um usuário acabou de concluir um treino de "${exercise.name}".
        Durante o treino, a IA forneceu ${corrections} correções de postura.
        
        Com base nisso, forneça uma única dica concisa, encorajadora e prática para o próximo treino para ajudá-lo a melhorar.
        Formule como uma sugestão amigável. A dica deve ser muito específica para o exercício realizado.
        
        Exemplo para Rosca Bíceps: "Ótimo trabalho! Da próxima vez, tente focar em manter os cotovelos colados ao lado do corpo para maximizar o isolamento do bíceps."
        Exemplo para Agachamentos: "Excelente! No seu próximo treino de pernas, pense em manter o peito para cima ao descer para manter as costas mais retas."

        Não retorne JSON, apenas a string da dica.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting AI summary from Gemini:", error);
        // Return a helpful fallback message in case of API error
        return "Concentre-se em manter um ritmo consistente e amplitude total de movimento na sua próxima sessão. Continue com o ótimo trabalho!";
    }
};

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Título chamativo para o plano de treino." },
        description: { type: Type.STRING, description: "Uma breve e encorajadora introdução ao plano." },
        workouts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "O número do dia (1, 2, 3)." },
                    title: { type: Type.STRING, description: "O título para o treino do dia (ex: 'Dia de Empurrar', 'Corpo Inteiro A')." },
                    focus: { type: Type.STRING, description: "Principais grupos musculares do dia." },
                    exercises: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                sets: { type: Type.STRING },
                                reps: { type: Type.STRING }
                            },
                            required: ["name", "sets", "reps"]
                        }
                    }
                },
                required: ["day", "title", "focus", "exercises"]
            }
        }
    },
    required: ["title", "description", "workouts"]
};

const fallbackPlan: WorkoutPlan = {
    title: "Plano de Fitness Padrão",
    description: "Aqui está um plano inicial padrão. Nossa IA está indisponível no momento, mas você pode usar isto para começar!",
    workouts: [
        {
            day: 1, title: "Força Total do Corpo A", focus: "Corpo Inteiro",
            exercises: [
                { name: "Agachamento Goblet", sets: "3", reps: "8-12" },
                { name: "Flexões", sets: "3", reps: "O máximo possível" },
                { name: "Remada com Halter", sets: "3", reps: "8-12 por lado" },
                { name: "Prancha", sets: "3", reps: "30-60 segundos" },
                { name: "Rosca Bíceps", sets: "2", reps: "10-15" }
            ]
        },
        {
            day: 2, title: "Força Total do Corpo B", focus: "Corpo Inteiro",
            exercises: [
                { name: "Levantamento Terra Romeno", sets: "3", reps: "8-12" },
                { name: "Desenvolvimento de Ombros", sets: "3", reps: "8-12" },
                { name: "Puxada na Polia Alta", sets: "3", reps: "8-12" },
                { name: "Leg Press", sets: "3", reps: "10-15" },
                { name: "Tríceps na Polia", sets: "2", reps: "10-15" }
            ]
        },
        {
            day: 3, title: "Força Total do Corpo C", focus: "Corpo Inteiro",
             exercises: [
                { name: "Afundos", sets: "3", reps: "10-12 por lado" },
                { name: "Supino", sets: "3", reps: "8-12" },
                { name: "Remada Sentada no Cabo", sets: "3", reps: "8-12" },
                { name: "Flexora de Pernas", sets: "3", reps: "10-15" },
                { name: "Puxada para o Rosto", sets: "2", reps: "15-20" }
            ]
        }
    ]
};


/**
 * Generates a personalized workout plan based on user's registration data.
 * @param data The user's registration data.
 * @returns A promise that resolves to a structured WorkoutPlan object.
 */
export const generateWorkoutPlan = async (data: RegistrationData): Promise<WorkoutPlan> => {
    const prompt = `
        Aja como um personal trainer especialista em IA. Crie um plano de treino semanal de 3 dias para um novo membro da academia com base em seu perfil.
        
        Perfil do Usuário:
        - Nome: ${data.name}
        - Idade: ${data.age}
        - Altura: ${data.height} cm
        - Peso: ${data.weight} kg
        - Observações de Saúde: ${data.healthNotes || 'Nenhuma'}
        - Objetivo Principal: ${data.goals}
        - Áreas de Foco: ${data.focusAreas}

        Gere um plano de treino dividido em 3 dias, equilibrado e amigável para iniciantes (ex: Empurrar/Puxar/Pernas, ou Corpo Inteiro).
        Para cada dia, forneça um título, um foco e uma lista de 5-6 exercícios com séries e faixas de repetições recomendadas.
        O plano deve ser encorajador e bem estruturado.
        Retorne a resposta como um objeto JSON que corresponda ao esquema fornecido.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlanSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WorkoutPlan;
    } catch (error) {
        console.error("Error generating workout plan from Gemini:", error);
        return fallbackPlan;
    }
};

/**
 * Generates a new, more challenging workout plan for a returning user.
 * @param data The user's original registration data.
 * @returns A promise that resolves to a new structured WorkoutPlan object.
 */
export const generateProgressiveWorkoutPlan = async (data: RegistrationData): Promise<WorkoutPlan> => {
    const prompt = `
        Aja como um personal trainer especialista em IA. Um membro recorrente da academia está pronto para um novo desafio e quer um plano de treino atualizado.
        Seu perfil original está abaixo.
        
        Perfil do Usuário:
        - Nome: ${data.name}
        - Idade: ${data.age}
        - Objetivo Principal: ${data.goals}
        - Áreas de Foco: ${data.focusAreas}

        Gere um NOVO plano de treino semanal de 3 dias que progrida de um nível iniciante. 
        Introduza alguns exercícios novos, aumente a intensidade ou ajuste o esquema de séries/repetições para promover sobrecarga progressiva.
        Mantenha o plano equilibrado e bem estruturado.
        O título e a descrição devem refletir que este é um plano atualizado e mais desafiador.
        Retorne a resposta como um objeto JSON que corresponda ao esquema fornecido.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlanSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WorkoutPlan;
    } catch (error) {
        console.error("Error generating progressive workout plan from Gemini:", error);
        // Return a slightly modified fallback plan to indicate progression
        const progressiveFallback = { ...fallbackPlan, title: "Plano de Fitness Nível Avançado" };
        progressiveFallback.description = "Nossa IA está indisponível no momento, mas aqui está um plano mais desafiador para você continuar progredindo!";
        return progressiveFallback;
    }
};