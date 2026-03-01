'use client';

import { useRef, useState } from 'react';

interface DraggableScrollRowProps {
  className?: string;
  children: React.ReactNode;
}

export default function DraggableScrollRow({ className = '', children }: DraggableScrollRowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const movedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    movedRef.current = false;
    startXRef.current = e.pageX - rowRef.current.offsetLeft;
    startScrollLeftRef.current = rowRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !rowRef.current) return;

    e.preventDefault();

    const x = e.pageX - rowRef.current.offsetLeft;
    const distance = x - startXRef.current;

    if (Math.abs(distance) > 6) {
      movedRef.current = true;
    }

    rowRef.current.scrollLeft = startScrollLeftRef.current - distance;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
    }
  };

  return (
    <div
      ref={rowRef}
      className={`${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={handleClickCapture}
    >
      {children}
    </div>
  );
}
