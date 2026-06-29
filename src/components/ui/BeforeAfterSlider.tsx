'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { Maximize2, ZoomIn } from 'lucide-react';

type Props = {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  onFullScreen?: () => void;
};

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Before treatment',
  afterAlt = 'After treatment',
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  onFullScreen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percentage 0-100
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, updatePosition]);

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragging) updatePosition(e.touches[0].clientX);
  }, [dragging, updatePosition]);

  const onTouchEnd = useCallback(() => setDragging(false), []);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'ba-slider relative rounded-2xl overflow-hidden select-none',
        'aspect-[4/3] sm:aspect-[16/10]',
        dragging ? 'cursor-ew-resize' : 'cursor-ew-resize',
        className
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* After Image (full width, behind) */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage}
          alt={afterAlt}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Before Image (clipped to slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Vertical Line */}
        <div className="h-full w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]" />
        {/* Handle Circle */}
        <div className={clsx(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white shadow-xl',
          'flex items-center justify-center transition-transform duration-200',
          (dragging || hovering) && 'scale-110'
        )}>
          <svg className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8l4 4-4 4" />
            <path d="M6 8l-4 4 4 4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className={clsx(
        'absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-opacity duration-300',
        hovering || dragging ? 'opacity-100' : 'opacity-70'
      )}>
        {beforeLabel}
      </div>
      <div className={clsx(
        'absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-opacity duration-300',
        hovering || dragging ? 'opacity-100' : 'opacity-70'
      )}>
        {afterLabel}
      </div>

      {/* Full Screen Button */}
      {onFullScreen && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFullScreen(); }}
          className="absolute top-4 right-4 z-20 rounded-xl bg-black/40 p-2 text-white hover:bg-black/60 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
