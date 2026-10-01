'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableDescriptionProps {
  html: string;
  maxHeight?: number;
  className?: string;
}

const ExpandableDescription = ({
  html,
  maxHeight = 200,
  className,
}: ExpandableDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Merenje visine sadržaja
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowButton(contentHeight > maxHeight);
    }
  }, [html, maxHeight]);

  return (
    <div className={cn('relative', className)}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{
          maxHeight: isExpanded
            ? `${contentRef.current?.scrollHeight || 9999}px`
            : `${maxHeight}px`,
        }}
      >
        <div
          ref={contentRef}
          className="minimal-tiptap-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Gradient overlay */}
        {showButton && !isExpanded && (
          <div className="from-card pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent transition-opacity duration-500" />
        )}
      </div>

      {/* Dugme */}
      {showButton && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 transition-all"
          >
            {isExpanded ? (
              <>
                Prikaži manje
                <ChevronUpIcon />
              </>
            ) : (
              <>
                Prikaži više
                <ChevronDownIcon />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableDescription;
