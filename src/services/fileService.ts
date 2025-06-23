
export interface FileGenerationRequest {
  type: 'zip' | 'txt' | 'json' | 'csv' | 'html' | 'js' | 'css';
  content: string;
  filename: string;
}

export const generateFile = async (request: FileGenerationRequest): Promise<{ url: string, filename: string }> => {
  try {
    console.log('Generating file:', request);
    
    let blob: Blob;
    let mimeType: string;
    
    switch (request.type) {
      case 'txt':
        mimeType = 'text/plain';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'json':
        mimeType = 'application/json';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'csv':
        mimeType = 'text/csv';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'html':
        mimeType = 'text/html';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'js':
        mimeType = 'text/javascript';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'css':
        mimeType = 'text/css';
        blob = new Blob([request.content], { type: mimeType });
        break;
      case 'zip':
        // For demo purposes, create a simple text file in zip format
        mimeType = 'application/zip';
        blob = new Blob([request.content], { type: mimeType });
        break;
      default:
        throw new Error(`Unsupported file type: ${request.type}`);
    }
    
    const url = URL.createObjectURL(blob);
    console.log('File generated successfully:', url);
    
    return {
      url,
      filename: request.filename
    };
  } catch (error) {
    console.error('Error generating file:', error);
    throw error;
  }
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
