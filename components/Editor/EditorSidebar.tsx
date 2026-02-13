import { ChevronDown, ChevronRight, Image as ImageIcon, Settings, Tag, Globe } from "lucide-react";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

interface ExtendedDoc extends Doc<"documents"> {
  coverImageUrl?: string | null;
}

interface EditorSidebarProps {
  document: ExtendedDoc | undefined | null;
  onUpdate: (updates: Partial<Doc<"documents">>) => void;
  onCoverImageUpload: (file: File) => void;
  onCoverImageRemove: () => void;
}

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-surface hover:bg-bg-secondary transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Icon className="w-4 h-4 text-text-tertiary" />
                    {title}
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-text-tertiary" /> : <ChevronRight className="w-4 h-4 text-text-tertiary" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-bg-secondary/30">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function EditorSidebar({ document, onUpdate, onCoverImageUpload, onCoverImageRemove }: EditorSidebarProps) {
  if (!document) return null;

  return (
    <div className="w-[320px] bg-surface border-l border-border h-[calc(100vh-72px)] overflow-y-auto sticky top-[72px] hidden lg:block">
        <AccordionItem title="Status & Visibility" icon={Globe} defaultOpen>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Visibility</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${document.isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {document.isPublished ? 'Public' : 'Private'}
                    </span>
                </div>
                {/* Publish Date, Author, etc. could go here */}
            </div>
        </AccordionItem>

        <AccordionItem title="Featured Image" icon={ImageIcon} defaultOpen>
             <div className="space-y-4">
                {document.coverImageUrl ? (
                    <div className="relative group rounded-lg overflow-hidden border border-border">
                        <img src={document.coverImageUrl} alt="Cover" className="w-full h-32 object-cover" />
                        <button 
                            onClick={onCoverImageRemove}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 text-text-tertiary mb-2" />
                            <p className="text-sm text-text-secondary">Upload Image</p>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && onCoverImageUpload(e.target.files[0])}
                        />
                    </label>
                )}
             </div>
        </AccordionItem>

        {/* Placeholder for other sections */}
        <AccordionItem title="Categories & Tags" icon={Tag}>
            <p className="text-xs text-text-tertiary">Tag management coming soon.</p>
        </AccordionItem>

        <AccordionItem title="SEO Settings" icon={Settings}>
            <div className="space-y-3">
                 <div>
                    <label className="text-xs font-medium text-text-secondary">Meta Title</label>
                    <input type="text" className="w-full mt-1 p-2 bg-bg border border-border rounded-md text-sm" placeholder={document.title} />
                 </div>
                 <div>
                    <label className="text-xs font-medium text-text-secondary">Slug</label>
                    <input type="text" className="w-full mt-1 p-2 bg-bg border border-border rounded-md text-sm" value={document.slug || ''} readOnly />
                 </div>
            </div>
        </AccordionItem>
    </div>
  );
}
