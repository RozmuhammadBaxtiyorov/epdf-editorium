
// Utility functions for PDF operations
import { saveAs } from 'file-saver';
import { pdfjs } from 'react-pdf';

// Initialize pdfjs with the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export interface Annotation {
  id: number;
  type: 'text' | 'highlight';
  page: number;
  position?: { x: number; y: number };
  bounds?: { x: number; y: number; width: number; height: number };
  text?: string;
}

// Load a specific page of a PDF file
export const loadPDFPage = async (file: File, pageNumber: number): Promise<any> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Page ${pageNumber} does not exist. Document has ${pdf.numPages} pages.`);
    }
    
    const page = await pdf.getPage(pageNumber);
    return page;
  } catch (error) {
    console.error('Error loading PDF page:', error);
    throw error;
  }
};

// Save the PDF with annotations
export const savePDFWithAnnotations = (originalFile: File, annotations: Annotation[]) => {
  // In a real implementation, we would use a PDF library to add the annotations to the PDF
  // For now, we'll just download the original file
  saveAs(originalFile, `annotated-${originalFile.name}`);
};

// Extract text from a PDF page
export const extractTextFromPDFPage = async (file: File, pageNumber: number): Promise<string> => {
  try {
    const page = await loadPDFPage(file, pageNumber);
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};

// Get PDF metadata
export const getPDFMetadata = async (file: File): Promise<any> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdf.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting metadata:', error);
    return null;
  }
};
