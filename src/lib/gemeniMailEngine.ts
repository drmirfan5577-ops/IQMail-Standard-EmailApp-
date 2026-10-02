import { GoogleGenerativeAI } from '@google/generative-ai';

export const processVoiceToEnterpriseMail = async (
  rawAudioText: string,
  apiKey: string
): Promise<{ subject: string; body: string; summary: string }> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
    You are an Enterprise AI Email Assistant for IQMail Platform.
    Convert the following rough voice note text into a formal, highly professional enterprise-grade official email.
    
    Raw Voice Input: "${rawAudioText}"
    
    Required Output Format (JSON):
    {
      "subject": "Professional Executive Subject Line",
      "summary": "Key points & directions sum-up",
      "body": "Complete, structured enterprise email with proper salutations, bullet points, action items, and directions."
    }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  try {
    return JSON.parse(responseText.replace(/```json|```/g, ''));
  } catch (e) {
    return {
      subject: "Official Communication - IQMail System",
      summary: "Processed from Voice Note",
      body: responseText
    };
  }
};
