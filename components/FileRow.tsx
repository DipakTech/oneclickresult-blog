"use client";

import { FileText, Image as ImageIcon, File, MoreVertical } from "lucide-react";
import { Doc } from "../convex/_generated/dataModel";

interface FileRowProps {
    file: Doc<"files"> & { url: string | null };
    onClick: () => void;
    isSelected?: boolean;
}

export default function FileRow({ file, onClick, isSelected }: FileRowProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "image":
                return <ImageIcon className="w-5 h-5 text-purple-500" />;
            case "pdf":
                return <FileText className="w-5 h-5 text-red-500" />;
            case "csv":
                return <FileText className="w-5 h-5 text-green-500" />;
            default:
                return <File className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <tr
            onClick={onClick}
            className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
        >
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded mr-3">
                        {file.type === 'image' && file.url ? (
                            <img src={file.url} alt="" className="h-8 w-8 object-cover rounded" />
                        ) : (
                            getIcon(file.type)
                        )}
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={file.name}>
                        {file.name}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                Me
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                Today
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}
