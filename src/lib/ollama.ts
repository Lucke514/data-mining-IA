import axios from 'axios';
import type { AnalysisResponse } from './types';

const OLLAMA_API_URL = 'http://147.79.81.209:11434/api/generate';

export async function analyzeData(data: string): Promise<string> {
  if (!data) {
    throw new Error('No hay datos para analizar');
  }

  try {
    const response = await axios.post<AnalysisResponse>(OLLAMA_API_URL, {
      model: 'llama3.2',
      prompt: `Analiza los siguientes datos CSV y proporciona insights relevantes:\n\n${data}`,
      stream: false
    });
    
    if (!response.data || typeof response.data.response !== 'string') {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Error de conexión con Ollama: ${message}`);
    }
    throw new Error('Error al analizar los datos');
  }
}