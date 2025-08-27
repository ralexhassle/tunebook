import { useEffect, useRef } from 'react';
import { renderAbc } from 'abcjs';

interface AbcNotationProps {
  abc: string;
  width?: number;
  height?: number;
}

function extractFirstMeasure(abc: string): string {
  // Diviser l'ABC en lignes
  const lines = abc.split('\n');
  const headerLines: string[] = [];
  const musicLines: string[] = [];
  let inMusic = false;

  for (const line of lines) {
    if (
      line.startsWith('X:') ||
      line.startsWith('T:') ||
      line.startsWith('K:') ||
      line.startsWith('M:') ||
      line.startsWith('L:') ||
      line.startsWith('R:')
    ) {
      headerLines.push(line);
      if (line.startsWith('K:')) {
        inMusic = true;
      }
    } else if (inMusic && line.trim() && !line.startsWith('%')) {
      musicLines.push(line);
      break; // Prendre seulement la première ligne de musique
    }
  }

  // Extraire la première mesure de la première ligne de musique
  if (musicLines.length > 0) {
    const firstLine = musicLines[0];
    const firstMeasure = firstLine.split('|')[0] + '|';
    return [...headerLines, firstMeasure].join('\n');
  }

  return abc; // Fallback si on ne peut pas extraire
}

export function AbcNotation({
  abc,
  width = 400,
  height = 150,
}: AbcNotationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && abc) {
      try {
        // Nettoyer le conteneur
        containerRef.current.innerHTML = '';

        // Extraire seulement la première mesure
        const firstMeasure = extractFirstMeasure(abc);

        // Render ABC notation
        renderAbc(containerRef.current, firstMeasure, {
          responsive: 'resize',
          staffwidth: width - 20,
          scale: 0.6,
          paddingtop: 0,
          paddingbottom: 0,
          paddingleft: 0,
          paddingright: 0,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.7,
            preferredMeasuresPerLine: 1,
          },
        });
      } catch (error) {
        console.error('Error rendering ABC notation:', error);
        containerRef.current.innerHTML =
          '<div style="color: #999; font-size: 12px;">Invalid ABC notation</div>';
      }
    }
  }, [abc, width]);

  if (!abc) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px',
        }}
      >
        No notation available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        overflow: 'hidden',
      }}
    />
  );
}
