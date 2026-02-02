import React from 'react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 mb-8 px-4 w-full flex justify-center">
      <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-givry border-2 border-cocoa/20 rounded-2xl p-3 sm:px-6 sm:py-3 shadow-[4px_4px_0px_0px_rgba(70,24,40,0.2)]">
        
        {/* Mobile Info Text */}
        <span className="sm:hidden font-mono text-xs font-bold text-cocoa tracking-widest">
          PAGE {currentPage} / {totalPages}
        </span>

        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-1 sm:flex-none min-w-[100px] hover:bg-cocoa/10"
            aria-label="Previous page"
          >
            ← PREV
          </Button>

          {/* Desktop Info Text */}
          <span className="hidden sm:block font-mono text-sm font-bold text-cocoa tracking-widest min-w-[120px] text-center mx-2">
            PAGE {currentPage} / {totalPages}
          </span>

          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex-1 sm:flex-none min-w-[100px] hover:bg-cocoa/10"
            aria-label="Next page"
          >
            NEXT →
          </Button>
        </div>
      </div>
    </nav>
  );
};