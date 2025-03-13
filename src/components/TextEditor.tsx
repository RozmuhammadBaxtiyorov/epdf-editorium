
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, Italic, Underline, AlignLeft, 
  AlignCenter, AlignRight, List
} from "lucide-react";

interface TextEditorProps {
  onAddText: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
  });

  const handleFormatting = (type: keyof typeof formatting, value?: any) => {
    setFormatting(prev => ({
      ...prev,
      [type]: value !== undefined ? value : !prev[type]
    }));
  };

  const handleAddText = () => {
    if (text.trim()) {
      // In a real implementation, we would apply the formatting to the text
      // Here we're just passing the raw text
      onAddText(text);
      setText('');
      setFormatting({
        bold: false,
        italic: false,
        underline: false,
        alignment: 'left',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add or Edit Text</h3>
      
      <div className="flex items-center gap-1 border-b pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('bold')}
          className={formatting.bold ? 'bg-gray-200' : ''}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('italic')}
          className={formatting.italic ? 'bg-gray-200' : ''}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('underline')}
          className={formatting.underline ? 'bg-gray-200' : ''}
        >
          <Underline size={16} />
        </Button>
        <div className="border-l h-6 mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('alignment', 'left')}
          className={formatting.alignment === 'left' ? 'bg-gray-200' : ''}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('alignment', 'center')}
          className={formatting.alignment === 'center' ? 'bg-gray-200' : ''}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormatting('alignment', 'right')}
          className={formatting.alignment === 'right' ? 'bg-gray-200' : ''}
        >
          <AlignRight size={16} />
        </Button>
        <div className="border-l h-6 mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
        >
          <List size={16} />
        </Button>
      </div>
      
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px]"
        placeholder="Enter your text here..."
      />
      
      <div className="flex justify-end">
        <Button onClick={handleAddText} className="bg-epdf-primary hover:bg-epdf-secondary">
          Add to PDF
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
