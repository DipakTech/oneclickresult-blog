"use client";

import { ReactNode } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: "🗑️",
            iconBg: "bg-red-100",
            confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
        },
        warning: {
            icon: "⚠️",
            iconBg: "bg-yellow-100",
            confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white",
        },
        info: {
            icon: "ℹ️",
            iconBg: "bg-blue-100",
            confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{styles.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{description}</p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmBtn}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
