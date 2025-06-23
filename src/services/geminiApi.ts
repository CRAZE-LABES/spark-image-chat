
const GEMINI_API_KEY = 'AIzaSyAVYUIsjT4sPDAMHySBqOUsH-nlv-i810Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    console.log('Sending message to Gemini API:', message);
    
    // Handle identity questions
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('who created you') || lowerMessage.includes('who made you')) {
      return 'I was created by **CraftingCrazeGaming** (company name).';
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      return 'I am **CrazeGPT**, based on Gemini AI which was created and trained by Google. I can help you with text formatting, image generation, file creation, and much more!';
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are CrazeGPT, a helpful AI assistant created by CraftingCrazeGaming. You are based on Gemini AI. You can format text using markdown syntax - use **bold**, *italic*, \`code\`, and create lists. You can help with generating images, creating files, and providing detailed assistance. Be helpful and professional. User message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API Success Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
