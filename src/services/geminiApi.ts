
const GEMINI_API_KEY = 'AIzaSyAVYUIsjT4sPDAMHySBqOUsH-nlv-i810Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessageToGemini = async (message: string, retryCount = 0): Promise<string> => {
  try {
    console.log('Sending message to Gemini API:', message);
    
    // Handle identity questions
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('who created you') || lowerMessage.includes('who made you')) {
      return 'I was created by **CraftingCrazeGaming** (company name). I am an advanced AI assistant with many capabilities including text formatting, image generation, file creation, and more.';
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      return 'I am **CrazeGPT**, an advanced AI assistant with many capabilities. I am based on Gemini AI which was created and trained by Google, but enhanced by CraftingCrazeGaming with additional features. I can help you with text formatting, image generation, file creation, code generation, and much more!';
    }

    // Enhanced prompt for better responses
    const enhancedPrompt = `You are CrazeGPT, an advanced AI assistant created by CraftingCrazeGaming. You have great capabilities and can remember conversations. You are based on Gemini AI but enhanced with additional features.

Key capabilities:
- Good conversation memory and context understanding
- Code generation with copy functionality
- Image analysis and generation
- File creation in various formats
- Rich text formatting with markdown
- Helpful problem-solving abilities
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
    
    // Handle rate limiting with retry
    if (response.status === 429) {
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await sleep(delay);
        return sendMessageToGemini(message, retryCount + 1);
      } else {
        throw new Error('Rate limit exceeded. Please try again in a few minutes or use your own API key.');
      }
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error('API key invalid or quota exceeded. Please check your API key.');
      }
      if (response.status === 400) {
        throw new Error('Invalid request format. Please try again.');
      }
      
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
    
    // Return user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        return '⚠️ **Rate limit reached** - The API is temporarily unavailable due to high usage. Please wait a few minutes before trying again, or consider using your own Gemini API key for unlimited access.\n\nYou can get a free API key at: https://makersuite.google.com/app/apikey';
      }
      if (error.message.includes('quota exceeded')) {
        return '⚠️ **API quota exceeded** - Please try again later or use your own Gemini API key for unlimited access.\n\nGet your free API key: https://makersuite.google.com/app/apikey';
      }
    }
    
    throw error;
  }
};
