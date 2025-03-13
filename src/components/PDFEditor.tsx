
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, FilePlus, Highlighter, Trash, 
  Type, Undo, Redo, ZoomIn, ZoomOut, Save, 
  Download, Pencil
} from "lucide-react";
import PDFViewer from './PDFViewer';
import TextEditor from './TextEditor';

const PDFEditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("view");
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [textAnnotations, setTextAnnotations] = useState<any[]>([]);
  const [highlightAnnotations, setHighlightAnnotations] = useState<any[]>([]);
  const [currentTool, setCurrentTool] = useState<string>("select");
  
  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type !== 'application/pdf') {
        toast.error("Please upload a PDF file");
        return;
      }
      
      setFile(uploadedFile);
      setPageNumber(1);
      toast.success("PDF file loaded successfully");
    }
  };

  // Function to handle document loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Page navigation functions
  const goToPreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  // Tool selection functions
  const selectTool = (tool: string) => {
    setCurrentTool(tool);
    toast.info(`${tool} tool selected`);
  };

  // Add text annotation
  const addTextAnnotation = (text: string, position: { x: number, y: number }) => {
    const newAnnotation = {
      id: Date.now(),
      type: 'text',
      text,
      position,
      page: pageNumber
    };
    
    setTextAnnotations(prev => [...prev, newAnnotation]);
    toast.success("Text added");
  };

  // Add highlight annotation
  const addHighlight = (bounds: { x: number, y: number, width: number, height: number }) => {
    const newHighlight = {
      id: Date.now(),
      type: 'highlight',
      bounds,
      page: pageNumber
    };
    
    setHighlightAnnotations(prev => [...prev, newHighlight]);
    toast.success("Text highlighted");
  };

  // Delete annotation
  const deleteAnnotation = (id: number, type: string) => {
    if (type === 'text') {
      setTextAnnotations(prev => prev.filter(anno => anno.id !== id));
    } else if (type === 'highlight') {
      setHighlightAnnotations(prev => prev.filter(anno => anno.id !== id));
    }
    toast.success("Annotation deleted");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with logo and upload button */}
      <header className="border-b p-4 flex justify-between items-center bg-epdf-primary text-white">
        <div className="flex items-center gap-2">
          <FileText size={28} />
          <h1 className="text-2xl font-bold">EPDF</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf"
              id="pdf-upload"
            />
            <Button asChild variant="outline" className="bg-white text-epdf-primary hover:bg-gray-100">
              <label htmlFor="pdf-upload" className="cursor-pointer flex items-center gap-2">
                <FilePlus size={16} />
                <span>Open PDF</span>
              </label>
            </Button>
          </div>
          {file && (
            <Button variant="outline" className="bg-white text-epdf-primary hover:bg-gray-100">
              <Download size={16} className="mr-2" />
              Save PDF
            </Button>
          )}
        </div>
      </header>

      {file ? (
        <div className="flex flex-col flex-grow">
          {/* Toolbar */}
          <div className="bg-gray-100 p-2 border-b flex items-center gap-2 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectTool('select')}
              className={currentTool === 'select' ? 'bg-epdf-secondary text-white' : ''}
            >
              <Pencil size={16} className="mr-1" />
              Select
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectTool('text')}
              className={currentTool === 'text' ? 'bg-epdf-secondary text-white' : ''}
            >
              <Type size={16} className="mr-1" />
              Add Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectTool('highlight')}
              className={currentTool === 'highlight' ? 'bg-epdf-secondary text-white' : ''}
            >
              <Highlighter size={16} className="mr-1" />
              Highlight
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectTool('erase')}
              className={currentTool === 'erase' ? 'bg-epdf-secondary text-white' : ''}
            >
              <Trash size={16} className="mr-1" />
              Delete
            </Button>
            <div className="border-l h-8 mx-2"></div>
            <Button variant="ghost" size="sm" onClick={zoomIn}>
              <ZoomIn size={16} />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={zoomOut}>
              <ZoomOut size={16} />
            </Button>
            <div className="border-l h-8 mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </div>

          {/* Main content area */}
          <div className="flex-grow overflow-auto bg-gray-200 p-4">
            <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="view">View PDF</TabsTrigger>
                <TabsTrigger value="edit">Edit Text</TabsTrigger>
              </TabsList>
              <TabsContent value="view" className="flex justify-center">
                <Card className="shadow-lg bg-white">
                  <CardContent className="p-6">
                    <PDFViewer
                      file={file}
                      pageNumber={pageNumber}
                      scale={scale}
                      onDocumentLoadSuccess={onDocumentLoadSuccess}
                      textAnnotations={textAnnotations.filter(a => a.page === pageNumber)}
                      highlightAnnotations={highlightAnnotations.filter(a => a.page === pageNumber)}
                      currentTool={currentTool}
                      onAddText={addTextAnnotation}
                      onAddHighlight={addHighlight}
                      onDeleteAnnotation={deleteAnnotation}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="edit">
                <Card>
                  <CardContent className="p-6">
                    <TextEditor
                      onAddText={(text) => {
                        // Position would be determined in a real implementation
                        addTextAnnotation(text, { x: 100, y: 100 });
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        // Welcome screen when no file is loaded
        <div className="flex flex-col items-center justify-center flex-grow p-10 bg-gray-50">
          <div className="text-center max-w-2xl">
            <FileText size={72} className="mx-auto mb-6 text-epdf-primary opacity-80" />
            <h2 className="text-3xl font-bold mb-4 text-epdf-text">Welcome to EPDF</h2>
            <p className="text-epdf-muted mb-8">
              Upload a PDF file to get started. EPDF allows you to view, annotate, highlight, and edit text in your PDF documents.
            </p>
            <Input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf"
              id="welcome-pdf-upload"
            />
            <Button asChild size="lg" className="bg-epdf-primary hover:bg-epdf-secondary">
              <label htmlFor="welcome-pdf-upload" className="cursor-pointer flex items-center gap-2">
                <FilePlus size={20} />
                <span>Open PDF Document</span>
              </label>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
