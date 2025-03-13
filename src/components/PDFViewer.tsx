
import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize pdfjs with the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  pageNumber: number;
  scale: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  textAnnotations: any[];
  highlightAnnotations: any[];
  currentTool: string;
  onAddText: (text: string, position: { x: number, y: number }) => void;
  onAddHighlight: (bounds: { x: number, y: number, width: number, height: number }) => void;
  onDeleteAnnotation: (id: number, type: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  pageNumber,
  scale,
  onDocumentLoadSuccess,
  textAnnotations,
  highlightAnnotations,
  currentTool,
  onAddText,
  onAddHighlight,
  onDeleteAnnotation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedAnnotation, setSelectedAnnotation] = useState<{id: number, type: string} | null>(null);
  
  useEffect(() => {
    // Reset states when switching pages or tools
    setSelectedText('');
    setClickPosition(null);
    setShowTextInput(false);
    setInputText('');
    setSelectedAnnotation(null);
  }, [pageNumber, currentTool]);

  const handleMouseUp = (e: React.MouseEvent) => {
    if (currentTool === 'highlight') {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedText(selection.toString());
        
        // Get the bounding rectangle of the selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Calculate position relative to the container
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const bounds = {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height
          };
          
          onAddHighlight(bounds);
          selection.removeAllRanges();
        }
      }
    } else if (currentTool === 'text') {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setClickPosition({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        });
        setShowTextInput(true);
      }
    }
  };

  const handleAnnotationClick = (id: number, type: string) => {
    if (currentTool === 'erase') {
      onDeleteAnnotation(id, type);
    } else if (currentTool === 'select') {
      setSelectedAnnotation({ id, type });
    }
  };

  const handleTextInputSubmit = () => {
    if (inputText.trim() && clickPosition) {
      onAddText(inputText, clickPosition);
      setShowTextInput(false);
      setInputText('');
      setClickPosition(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative" 
      onMouseUp={handleMouseUp}
    >
      {file && (
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="relative"
          />
          
          {/* Text annotations */}
          {textAnnotations.map((anno) => (
            <div
              key={anno.id}
              className={cn(
                "absolute p-2 border rounded bg-white shadow-sm cursor-pointer",
                selectedAnnotation?.id === anno.id && selectedAnnotation?.type === 'text' ? 
                  "ring-2 ring-epdf-accent" : ""
              )}
              style={{
                left: `${anno.position.x}px`,
                top: `${anno.position.y}px`,
                zIndex: 10
              }}
              onClick={() => handleAnnotationClick(anno.id, 'text')}
            >
              {anno.text}
            </div>
          ))}
          
          {/* Highlight annotations */}
          {highlightAnnotations.map((anno) => (
            <div
              key={anno.id}
              className={cn(
                "absolute bg-yellow-200 opacity-50 cursor-pointer",
                selectedAnnotation?.id === anno.id && selectedAnnotation?.type === 'highlight' ? 
                  "ring-2 ring-epdf-accent" : ""
              )}
              style={{
                left: `${anno.bounds.x}px`,
                top: `${anno.bounds.y}px`,
                width: `${anno.bounds.width}px`,
                height: `${anno.bounds.height}px`,
                zIndex: 10
              }}
              onClick={() => handleAnnotationClick(anno.id, 'highlight')}
            >
            </div>
          ))}
          
          {/* Text input overlay */}
          {showTextInput && clickPosition && (
            <div
              className="absolute bg-white p-2 border rounded shadow-lg z-20"
              style={{
                left: `${clickPosition.x}px`,
                top: `${clickPosition.y}px`,
              }}
            >
              <textarea
                className="border p-1 w-48 text-sm"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text..."
                autoFocus
              />
              <div className="flex justify-end mt-2 gap-1">
                <button 
                  className="px-2 py-1 bg-gray-200 text-xs rounded"
                  onClick={() => setShowTextInput(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-2 py-1 bg-epdf-primary text-white text-xs rounded"
                  onClick={handleTextInputSubmit}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;
