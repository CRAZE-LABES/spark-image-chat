
export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  id: string;
}

export const generateImage = async (request: ImageGenerationRequest): Promise<GeneratedImage> => {
  // Simulate API call - in a real app, this would call DALL-E, Midjourney, etc.
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, using a placeholder image service
  const width = request.width || 512;
  const height = request.height || 512;
  const seed = Math.floor(Math.random() * 1000);
  
  return {
    id: `img_${Date.now()}`,
    url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    prompt: request.prompt
  };
};
