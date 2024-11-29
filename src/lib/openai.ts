import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export async function analyzeData(data: string): Promise<string> {
  if (!data) {
    throw new Error('No hay datos para analizar');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un analista de datos experto. Tu tarea es analizar datos CSV y proporcionar insights relevantes de manera clara y concisa."
        },
        {
          role: "user",
          content: `Analiza los siguientes datos CSV y proporciona insights relevantes:\n\n${data}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0]?.message?.content;
    
    if (!analysis) {
      throw new Error('No se pudo generar el análisis');
    }
    
    return analysis;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`Error de OpenAI: ${error.message}`);
    }
    throw new Error('Error al analizar los datos');
  }
}