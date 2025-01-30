import React, { useState, useCallback } from 'react';
import { FlipChar } from './FlipChar';
import { Maximize2, Minimize2 } from 'lucide-react';

interface TrainBoardProps {
  text: string;
  rows?: number;
}

export function TrainBoard({ text, rows = 6 }: TrainBoardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const formatText = (text: string): string[] => {
    // Split text into lines by newline character
    const inputLines = text.split('\n');
    const lines: string[] = [];

    // Process each line to ensure it fits within 24 characters
    inputLines.forEach(line => {
      if (line.length <= 24) {
        lines.push(line);
      } else {
        // Split long lines into multiple lines
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          if (currentLine.length + word.length + 1 <= 24) {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) {
          lines.push(currentLine);
        }
      }
    });

    // Center the text vertically
    const totalLines = Math.min(lines.length, rows);
    const startRow = Math.floor((rows - totalLines) / 2);
    
    // Create array with empty lines for padding
    const paddedLines = Array(rows).fill('');
    lines.slice(0, rows).forEach((line, index) => {
      paddedLines[startRow + index] = line;
    });

    return paddedLines;
  };

  const padText = (text: string, length: number) => {
    const padding = Math.floor((length - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(length - text.length - padding);
  };

  const renderRow = (text: string, rowIndex: number) => {
    const chars = padText(text, 24).split('');
    return (
      <div key={rowIndex} className="flex justify-center mb-[2px]">
        {chars.map((char, index) => (
          <FlipChar
            key={`${rowIndex}-${index}-${char}`}
            char={char}
            delay={index * 50 + rowIndex * 500}
          />
        ))}
      </div>
    );
  };

  const formattedLines = formatText(text);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0' : ''}`}>
      <div className="bg-black p-6 rounded-lg shadow-2xl">
        {/* Board frame */}
        <div className="relative bg-black p-1 border border-zinc-800">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-inner pointer-events-none" />
          
          {/* Display rows */}
          <div className="mb-6">
            {formattedLines.map((line, index) => renderRow(line, index))}
          </div>
        </div>
        
        {/* Fullscreen toggle button - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="flex justify-end mt-6">
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 focus:outline-none border border-zinc-800"
            >
              <Maximize2 className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}