"use client";

import { X } from "lucide-react";

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
      iconBg: "bg-red-100 [data-theme='dark']:bg-red-900/30",
      confirmBtn:
        "bg-danger hover:bg-red-600 text-white",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-warning-light [data-theme='dark']:bg-amber-900/30",
      confirmBtn:
        "bg-warning hover:bg-amber-600 text-white",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-primary-light",
      confirmBtn:
        "bg-primary hover:bg-primary-hover text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-surface rounded-panel shadow-overlay max-w-md w-full mx-4 p-6 animate-scale-in border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center mb-4`}
        >
          <span className="text-2xl">{styles.icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="
              px-5 h-11 rounded-btn text-sm font-semibold
              text-text-primary bg-bg-secondary hover:bg-border
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-5 h-11 rounded-btn text-sm font-semibold
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${styles.confirmBtn}
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
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
