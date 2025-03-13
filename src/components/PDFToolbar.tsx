
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText, Highlighter, Trash, Type, 
  ZoomIn, ZoomOut, Save, Download, 
  Pencil, Search, Info, ArrowLeft, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface PDFToolbarProps {
  currentTool: string;
  selectTool: (tool: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  scale: number;
  pageNumber: number;
  numPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  onJumpToPage: (page: number) => void;
  onSave: () => void;
  onExtractText: () => void;
  onShowMetadata: () => void;
}

const PDFToolbar: React.FC<PDFToolbarProps> = ({
  currentTool,
  selectTool,
  zoomIn,
  zoomOut,
  scale,
  pageNumber,
  numPages,
  goToPreviousPage,
  goToNextPage,
  onJumpToPage,
  onSave,
  onExtractText,
  onShowMetadata
}) => {
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      onJumpToPage(page);
    }
  };

  return (
    <div className="bg-gray-100 p-2 border-b flex flex-wrap items-center gap-2 overflow-x-auto">
      <TooltipProvider>
        {/* Annotation tools */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectTool('select')}
                className={cn(currentTool === 'select' ? 'bg-epdf-secondary text-white' : '')}
              >
                <Pencil size={16} className="mr-1" />
                Select
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select annotations</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectTool('text')}
                className={cn(currentTool === 'text' ? 'bg-epdf-secondary text-white' : '')}
              >
                <Type size={16} className="mr-1" />
                Add Text
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add text annotations</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectTool('highlight')}
                className={cn(currentTool === 'highlight' ? 'bg-epdf-secondary text-white' : '')}
              >
                <Highlighter size={16} className="mr-1" />
                Highlight
              </Button>
            </TooltipTrigger>
            <TooltipContent>Highlight text</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectTool('erase')}
                className={cn(currentTool === 'erase' ? 'bg-epdf-secondary text-white' : '')}
              >
                <Trash size={16} className="mr-1" />
                Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete annotations</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="border-l h-8 mx-2"></div>
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={zoomIn}>
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
          
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={zoomOut}>
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="border-l h-8 mx-2"></div>
        
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
              >
                <ArrowLeft size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={handlePageInputChange}
              className="w-16 h-8 text-center"
            />
            <span className="text-sm">of {numPages}</span>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                <ArrowRight size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="border-l h-8 mx-2"></div>
        
        {/* Additional tools */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onSave}>
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save with annotations</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onExtractText}>
                <Search size={16} className="mr-1" />
                Extract Text
              </Button>
            </TooltipTrigger>
            <TooltipContent>Extract text from current page</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onShowMetadata}>
                <Info size={16} className="mr-1" />
                Metadata
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show document metadata</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PDFToolbar;
