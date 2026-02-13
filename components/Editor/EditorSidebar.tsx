import { ChevronDown, ChevronRight, Image as ImageIcon, Settings, Tag, Globe } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [localAuthorName, setLocalAuthorName] = useState("");
  const [localAuthorImageUrl, setLocalAuthorImageUrl] = useState("");
  const [localMetaTitle, setLocalMetaTitle] = useState("");
  const [localMetaDescription, setLocalMetaDescription] = useState("");
  const [localFocusKeyphrase, setLocalFocusKeyphrase] = useState("");

  // Sync local state with document when it changes
  useEffect(() => {
    if (document) {
      setLocalAuthorName(document.authorName || "");
      setLocalAuthorImageUrl(document.authorImageUrl || "");
      setLocalMetaTitle(document.metaTitle || "");
      setLocalMetaDescription(document.metaDescription || "");
      setLocalFocusKeyphrase(document.focusKeyphrase || "");
    }
  }, [document?._id]); // Only reset when document ID changes

  // Debounce timer for author fields
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document && (localAuthorName !== document.authorName || localAuthorImageUrl !== document.authorImageUrl)) {
        onUpdate({ 
          authorName: localAuthorName || undefined,
          authorImageUrl: localAuthorImageUrl || undefined
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localAuthorName, localAuthorImageUrl]);

  // Debounce timer for SEO fields
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document && (
        localMetaTitle !== document.metaTitle ||
        localMetaDescription !== document.metaDescription ||
        localFocusKeyphrase !== document.focusKeyphrase
      )) {
        onUpdate({ 
          metaTitle: localMetaTitle || undefined,
          metaDescription: localMetaDescription || undefined,
          focusKeyphrase: localFocusKeyphrase || undefined
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localMetaTitle, localMetaDescription, localFocusKeyphrase]);

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
                
                {/* Author Information */}
                <div className="space-y-3 pt-2 border-t border-border">
                    <label className="text-xs font-medium text-text-secondary">Author Name</label>
                    <input 
                        type="text" 
                        className="w-full p-2 bg-bg border border-border rounded-md text-sm"
                        placeholder="Enter author name"
                        value={localAuthorName}
                        onChange={(e) => setLocalAuthorName(e.target.value)}
                    />
                    
                    <label className="text-xs font-medium text-text-secondary">Author Image URL (optional)</label>
                    <input 
                        type="url" 
                        className="w-full p-2 bg-bg border border-border rounded-md text-sm"
                        placeholder="https://example.com/avatar.jpg"
                        value={localAuthorImageUrl}
                        onChange={(e) => setLocalAuthorImageUrl(e.target.value)}
                    />
                    
                    {localAuthorImageUrl && (
                        <div className="mt-2">
                            <img 
                                src={localAuthorImageUrl} 
                                alt="Author preview" 
                                className="w-12 h-12 rounded-full object-cover border-2 border-border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
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

        <AccordionItem title="SEO Settings" icon={Settings} defaultOpen>
            <div className="space-y-4">
                {/* Meta Title */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-text-secondary">Meta Title</label>
                        <span className={`text-xs ${(localMetaTitle?.length || 0) > 60 ? 'text-error' : (localMetaTitle?.length || 0) > 50 ? 'text-warning' : 'text-text-tertiary'}`}>
                            {localMetaTitle?.length || 0}/60
                        </span>
                    </div>
                    <input 
                        type="text" 
                        className="w-full p-2 bg-bg border border-border rounded-md text-sm"
                        placeholder={document.title}
                        value={localMetaTitle}
                        onChange={(e) => setLocalMetaTitle(e.target.value)}
                        maxLength={70}
                    />
                    <p className="text-xs text-text-tertiary mt-1">Defaults to article title if empty</p>
                </div>

                {/* Meta Description */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-text-secondary">Meta Description</label>
                        <span className={`text-xs ${(localMetaDescription?.length || 0) > 160 ? 'text-error' : (localMetaDescription?.length || 0) > 150 ? 'text-warning' : 'text-text-tertiary'}`}>
                            {localMetaDescription?.length || 0}/160
                        </span>
                    </div>
                    <textarea 
                        className="w-full p-2 bg-bg border border-border rounded-md text-sm resize-none"
                        placeholder="Brief summary for search engines..."
                        value={localMetaDescription}
                        onChange={(e) => setLocalMetaDescription(e.target.value)}
                        rows={3}
                        maxLength={170}
                    />
                </div>

                {/* Focus Keyphrase */}
                <div>
                    <label className="text-xs font-medium text-text-secondary">Focus Keyphrase</label>
                    <input 
                        type="text" 
                        className="w-full mt-1 p-2 bg-bg border border-border rounded-md text-sm"
                        placeholder="Primary keyword or phrase"
                        value={localFocusKeyphrase}
                        onChange={(e) => setLocalFocusKeyphrase(e.target.value)}
                    />
                    <p className="text-xs text-text-tertiary mt-1">Main keyword to rank for</p>
                </div>

                {/* Canonical URL */}
                <div>
                    <label className="text-xs font-medium text-text-secondary">Canonical URL (optional)</label>
                    <input 
                        type="url" 
                        className="w-full mt-1 p-2 bg-bg border border-border rounded-md text-sm"
                        value={document.canonicalUrl || ''}
                        onChange={(e) => onUpdate({ canonicalUrl: e.target.value })}
                        placeholder="https://example.com/article"
                    />
                </div>

                {/* Slug (read-only) */}
                <div>
                    <label className="text-xs font-medium text-text-secondary">URL Slug</label>
                    <input 
                        type="text" 
                        className="w-full mt-1 p-2 bg-bg-secondary border border-border rounded-md text-sm text-text-tertiary"
                        value={document.slug || 'auto-generated-on-publish'} 
                        readOnly 
                    />
                </div>

                {/* Reading Time (auto-calculated) */}
                {document.readingTime !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Reading Time</span>
                        <span className="font-medium text-text-primary">{document.readingTime} min</span>
                    </div>
                )}
            </div>
        </AccordionItem>
    </div>
  );
}
