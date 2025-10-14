import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker safely
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

/**
 * Parse PDF file and extract text and images
 */
export async function parsePDF(file) {
  try {
    // Ensure worker is configured
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Validate PDF structure
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      // Optimize for mobile performance and error handling
      useWorkerFetch: false,
      isEvalSupported: false,
      disableAutoFetch: true,
      disableStream: true,
      verbosity: 0, // Reduce console warnings
      standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    }).promise;
    
    let fullText = '';
    const images = [];
    
    // Extract text and images from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
      // Extract text
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
      
      // Extract images with reduced scale for mobile
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 1.0 : 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { 
        alpha: false, 
        desynchronized: true 
      });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        intent: 'display'
      }).promise;
      
      // Check if page has substantial content (not just white)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let nonWhitePixels = 0;
      
      for (let j = 0; j < data.length; j += 4) {
        if (data[j] < 250 || data[j + 1] < 250 || data[j + 2] < 250) {
          nonWhitePixels++;
        }
      }
      
      // If page has substantial content, save it
      if (nonWhitePixels > 1000) {
        // Use lower quality for mobile to reduce memory
        const quality = isMobile ? 0.6 : 0.8;
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        images.push({
          pageNumber: i,
          dataUrl: dataUrl,
          description: `Page ${i}`
        });
      }
      
      // Clean up canvas to free memory
      canvas.width = 0;
      canvas.height = 0;
    }
    
    return {
      text: fullText.trim(),
      images: images,
      pageCount: pdf.numPages
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure it\'s a valid PDF.');
  }
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      text: result.value.trim(),
      images: [], // Mammoth doesn't easily extract images
      pageCount: null
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
  }
}

/**
 * Parse TXT file
 */
export async function parseTXT(file) {
  try {
    const text = await file.text();
    
    return {
      text: text.trim(),
      images: [],
      pageCount: null
    };
  } catch (error) {
    console.error('Error parsing TXT:', error);
    throw new Error('Failed to parse text file.');
  }
}

/**
 * Main parser function that routes to appropriate parser
 */
export async function parseFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return parsePDF(file);
    case 'docx':
    case 'doc':
      return parseDOCX(file);
    case 'txt':
      return parseTXT(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * Extract figures from PDF specifically
 */
export async function extractPDFImages(file) {
  try {
    // Ensure worker is configured
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Validate PDF before processing
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.warn('Empty PDF file for image extraction');
      return [];
    }
    
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0, // Suppress warnings
      standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    }).promise;
    
    const figures = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const dataUrl = canvas.toDataURL('image/png', 0.9);
      figures.push({
        id: `figure-${i}`,
        pageNumber: i,
        dataUrl: dataUrl,
        caption: `Figure from Page ${i}`,
        description: null
      });
    }
    
    return figures;
  } catch (error) {
    console.error('Error extracting PDF images:', error);
    // Return empty array instead of throwing - graceful degradation
    return [];
  }
}

/**
 * Validate file size and type
 */
export function validateFile(file) {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
  
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 50MB'
    };
  }
  
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Only PDF, DOCX, and TXT files are supported'
    };
  }
  
  return { valid: true };
}
