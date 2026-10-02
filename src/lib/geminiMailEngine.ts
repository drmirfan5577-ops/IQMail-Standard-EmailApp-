import { GoogleGenerativeAI } from '@google/generative-ai';

export const processVoiceToEnterpriseMail = async (
  rawAudioText: string,
  apiKey: string
): Promise<{ subject: string; body: string; summary: string }> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey || 'MOCK_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are an Enterprise AI Email Assistant for IQMail Platform.
      Convert the following rough voice note text into a formal, highly professional enterprise-grade official email.
      
      Raw Voice Input: "${rawAudioText}"
      
      Required Output Format (JSON):
      {
        "subject": "Executive Subject Line",
        "summary": "Key points & directions sum-up",
        "body": "Complete structured enterprise email with salutations, bullet points, and action items."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.replace(/```json|```/g, ''));
  } catch (e) {
    return {
      subject: "Official Communication - IQMail System",
      summary: "Processed from Voice Note Input",
      body: `Dear Recipient,\n\nRegarding the recent voice dispatch:\n"${rawAudioText}"\n\nPlease consider this as an official instruction from the management.\n\nBest regards,\nIQMail Enterprise System`
    };
  }
};
