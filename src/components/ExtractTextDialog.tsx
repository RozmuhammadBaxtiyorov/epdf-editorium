
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ExtractTextDialogProps {
  isOpen: boolean;
  onClose: () => void;
  extractedText: string;
  pageNumber: number;
}

const ExtractTextDialog: React.FC<ExtractTextDialogProps> = ({ 
  isOpen, 
  onClose, 
  extractedText,
  pageNumber 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Extracted Text - Page {pageNumber}</DialogTitle>
          <DialogDescription>
            Text content extracted from the current page
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Textarea
            value={extractedText}
            readOnly
            className="min-h-[300px] font-mono text-sm"
          />
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={copyToClipboard} className="gap-2">
            <Copy size={16} />
            Copy to Clipboard
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtractTextDialog;
