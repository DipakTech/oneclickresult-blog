export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function processContentForTOC(content: string | undefined): {
  processedContent: string;
  toc: TOCItem[];
} {
  if (!content) return { processedContent: "", toc: [] };

  try {
    const json = JSON.parse(content);
    const toc: TOCItem[] = [];
    let idCounter = 0;

    const traverse = (node: any) => {
      if (node.type === "heading") {
        const text = node.content?.[0]?.text;
        if (text) {
          const id = `heading-${idCounter++}`;
          // Inject ID into node attributes
          node.attrs = {
            ...node.attrs,
            id,
          };
          toc.push({
            id,
            text,
            level: node.attrs?.level || 2,
          });
        }
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(json);

    return {
      processedContent: JSON.stringify(json),
      toc,
    };
  } catch (e) {
    console.error("Failed to process TOC", e);
    return { processedContent: content, toc: [] };
  }
}
