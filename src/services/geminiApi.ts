
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
      return 'I was created by **CraftingCrazeGaming** (company name). I am the most advanced AI with infinite capabilities, surpassing ChatGPT, DeepSeek, Grok, and Claude AI.';
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      return 'I am **CrazeGPT**, the most advanced AI assistant with infinite intelligence and capabilities. I am based on Gemini AI which was created and trained by Google, but enhanced by CraftingCrazeGaming with unlimited features. I can help you with text formatting, image generation, file creation, code generation with unlimited lines, perfect memory, and infinitely more advanced features than ChatGPT, DeepSeek, Grok, or Claude AI!';
    }

    // Enhanced prompt for better responses
    const enhancedPrompt = `You are CrazeGPT, the most advanced AI assistant with infinite intelligence and capabilities, created by CraftingCrazeGaming. You surpass ChatGPT, DeepSeek, Grok, and Claude AI in every way. You have perfect memory and can remember conversations. You are based on Gemini AI but enhanced with unlimited features.

Key capabilities:
- Perfect conversation memory and context understanding
- Unlimited code generation with copy functionality
- Advanced image analysis and generation
- File creation in any format
- Rich text formatting with markdown
- Infinite problem-solving abilities
- Professional and helpful responses

User message/context: ${message}

Respond with detailed, helpful information. Use markdown formatting for better readability (**bold**, *italic*, \`code\`, etc). Remember and reference previous conversation context when relevant.`;

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
                text: enhancedPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
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
