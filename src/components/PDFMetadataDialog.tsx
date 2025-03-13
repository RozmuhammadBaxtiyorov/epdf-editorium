
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PDFMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: any;
}

const PDFMetadataDialog: React.FC<PDFMetadataDialogProps> = ({ isOpen, onClose, metadata }) => {
  if (!metadata) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>PDF Document Metadata</DialogTitle>
          <DialogDescription>
            Information about the PDF document
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            {metadata.info && (
              <div className="space-y-2">
                <h3 className="font-semibold">Document Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(metadata.info).map(([key, value]: [string, any]) => (
                    <React.Fragment key={key}>
                      <div className="font-medium text-gray-700">{key}</div>
                      <div className="text-gray-900">{String(value)}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            
            {metadata.metadata && (
              <div className="space-y-2">
                <h3 className="font-semibold">XMP Metadata</h3>
                <div className="text-sm text-gray-700">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded">
                    {JSON.stringify(metadata.metadata.getAll(), null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogClose asChild>
          <Button className="w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PDFMetadataDialog;
