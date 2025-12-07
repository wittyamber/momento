import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export async function generateGif(images: string[], delay: number = 500): Promise<Blob> {
  return new Promise(async (resolve) => {
    // 1. Load images into HTMLImageElements
    const loadedImages = await Promise.all(
      images.map(src => new Promise<HTMLImageElement>((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = src;
      }))
    );

    // 2. Setup Encoder
    // We assume all images are same size (taken from video feed)
    const width = loadedImages[0].width;
    const height = loadedImages[0].height;
    
    const encoder = new GIFEncoder();
    
    // 3. Process Frames
    loadedImages.forEach((img) => {
      // Draw image to a temp canvas to get pixel data
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, width, height).data;
      
      // Quantize colors (GIFs are limited to 256 colors)
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      
      // Add frame to encoder
      encoder.writeFrame(index, width, height, { palette, delay });
    });

    encoder.finish();

    // 4. Return Blob
    const buffer = encoder.bytes();
    resolve(new Blob([buffer], { type: 'image/gif' }));
  });
}