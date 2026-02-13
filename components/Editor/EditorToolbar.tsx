import { 
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, CheckSquare,
    Link as LinkIcon, Image as ImageIcon, Code, Quote, Table as TableIcon,
    Highlighter, Eraser, Heading1, Heading2, Heading3
} from "lucide-react";
import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => Promise<string | null>;
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  };

  const ToggleButton = ({ 
    isActive, 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    isActive?: boolean; 
    onClick: () => void; 
    icon: any; 
    title: string 
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-md transition-all duration-200
        ${isActive 
          ? "bg-primary/10 text-primary" 
          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
        }
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="sticky top-[72px] z-40 h-[56px] bg-surface/95 backdrop-blur-sm border-b border-border flex items-center justify-center px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
            <ToggleButton 
                onClick={() => editor.chain().focus().toggleBold().run()} 
                isActive={editor.isActive('bold')} 
                icon={Bold} 
                title="Bold" 
            />
            <ToggleButton 
                onClick={() => editor.chain().focus().toggleItalic().run()} 
                isActive={editor.isActive('italic')} 
                icon={Italic} 
                title="Italic" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleStrike().run()} 
                isActive={editor.isActive('strike')} 
                icon={Strikethrough} 
                title="Strikethrough" 
            />
        </div>

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
            <ToggleButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                isActive={editor.isActive('heading', { level: 1 })} 
                icon={Heading1} 
                title="Heading 1" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                isActive={editor.isActive('heading', { level: 2 })} 
                icon={Heading2} 
                title="Heading 2" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
                isActive={editor.isActive('heading', { level: 3 })} 
                icon={Heading3} 
                title="Heading 3" 
            />
        </div>
        
        {/* Alignment & Lists */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
             <ToggleButton 
                onClick={() => editor.chain().focus().setTextAlign('left').run()} 
                isActive={editor.isActive({ textAlign: 'left' })} 
                icon={AlignLeft} 
                title="Align Left" 
            />
            <ToggleButton 
                onClick={() => editor.chain().focus().setTextAlign('center').run()} 
                isActive={editor.isActive({ textAlign: 'center' })} 
                icon={AlignCenter} 
                title="Align Center" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleBulletList().run()} 
                isActive={editor.isActive('bulletList')} 
                icon={List} 
                title="Bullet List" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                isActive={editor.isActive('orderedList')} 
                icon={ListOrdered} 
                title="Ordered List" 
            />
        </div>

        {/* Insert */}
        <div className="flex items-center gap-0.5 pl-2">
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                isActive={editor.isActive('blockquote')} 
                icon={Quote} 
                title="Quote" 
            />
             <ToggleButton 
                onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                isActive={editor.isActive('codeBlock')} 
                icon={Code} 
                title="Code Block" 
            />
            <ToggleButton 
                onClick={() => editor.chain().focus().unsetAllMarks().run()} 
                icon={Eraser} 
                title="Clear Formatting" 
            />
        </div>
      </div>
    </div>
  );
}
