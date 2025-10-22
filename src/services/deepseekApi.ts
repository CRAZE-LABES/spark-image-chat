const DEEPSEEK_API_KEY = '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';
const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessageToDeepSeek = async (message: string, retryCount = 0): Promise<string> => {
  try {
    console.log('Sending message to DeepSeek API:', message);
    
    // Handle identity questions
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('who created you') || lowerMessage.includes('who made you')) {
      return 'I was created by **CraftingCrazeGaming** (company name). I am an advanced AI assistant powered by DeepSeek v3.1 with many capabilities including text formatting, image generation, file creation, and more.';
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      return 'I am **CrazeGPT**, an advanced AI assistant powered by DeepSeek v3.1. I was enhanced by CraftingCrazeGaming with additional features. I can help you with text formatting, image generation, file creation, code generation, and much more!';
    }

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are CrazeGPT, an advanced AI assistant created by CraftingCrazeGaming. You are powered by DeepSeek v3.1 and have great capabilities and can remember conversations.

Key capabilities:
- Good conversation memory and context understanding
- Code generation with copy functionality
- Image analysis and generation
- File creation in various formats
- Rich text formatting with markdown
- Helpful problem-solving abilities
- Professional and helpful responses

Respond with detailed, helpful information. Use markdown formatting for better readability (**bold**, *italic*, \`code\`, etc). Remember and reference previous conversation context when relevant.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://crazegpt.app',
        'X-Title': 'CrazeGPT',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: messages,
        temperature: 0.8,
        top_p: 0.95,
        max_tokens: 4096,
        stream: false
      }),
    });

    console.log('API Response status:', response.status);
    
    // Handle rate limiting with retry
    if (response.status === 429) {
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await sleep(delay);
        return sendMessageToDeepSeek(message, retryCount + 1);
      } else {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API Error Response:', errorText);
      
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
    console.log('DeepSeek API Success Response:', data);
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from DeepSeek API');
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    
    // Return user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        return '⚠️ **Rate limit reached** - The API is temporarily unavailable due to high usage. Please wait a few minutes before trying again.';
      }
      if (error.message.includes('quota exceeded')) {
        return '⚠️ **API quota exceeded** - Please try again later or check your DeepSeek API key usage.';
      }
    }
    
    throw error;
  }
};