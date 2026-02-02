import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  altText?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageSrc, altText }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gigas/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-givry/60 hover:text-givry hover:bg-white/10 rounded-full p-2 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-givry"
        aria-label="Close full screen view"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={altText || 'Full screen view'} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-cocoa/20 select-none"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>,
    document.body
  );
};