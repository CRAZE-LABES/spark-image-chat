
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
  try {
    console.log('Generating image with prompt:', request.prompt);
    
    // Simulate API call with better loading time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const width = request.width || 512;
    const height = request.height || 512;
    
    // Use multiple image services for variety
    const imageServices = [
      `https://picsum.photos/seed/${Date.now()}/${width}/${height}`,
      `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(request.prompt)}`,
      `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/${width}/${height}`
    ];
    
    const selectedService = imageServices[Math.floor(Math.random() * imageServices.length)];
    
    console.log('Image generated successfully');
    
    return {
      id: `img_${Date.now()}`,
      url: selectedService,
      prompt: request.prompt
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
