import { useEffect, useRef } from 'react';
import { renderAbc } from 'abcjs';

interface AbcNotationProps {
  abc: string;
  width?: number;
  height?: number;
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

        // Render ABC notation
        renderAbc(containerRef.current, abc, {
          responsive: 'resize',
          staffwidth: width - 20,
          scale: 0.8,
          paddingtop: 0,
          paddingbottom: 0,
          paddingleft: 0,
          paddingright: 0,
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
