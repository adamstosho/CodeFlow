import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

interface DiagramViewerProps {
  mermaidCode: string;
  onSvgReady?: (svgContent: string) => void;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ mermaidCode, onSvgReady }) => {
  const diagramId = useRef(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isRendering, setIsRendering] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        await mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
        });
      } catch (error) {
        console.error('DiagramViewer: Error initializing mermaid:', error);
      }
    };
    
    initializeMermaid();
  }, []);

  const renderDiagram = useCallback(async () => {
    
    if (!mermaidCode || !mermaidCode.trim()) {
      setSvgContent('');
      setError('');
      setIsRendering(false);
      return;
    }

    // Handle Python placeholder message
    if (mermaidCode === "Python parsing not yet implemented.") {
      setSvgContent(`
        <div class="flex items-center justify-center h-64 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div class="text-center">
            <div class="text-yellow-600 text-lg font-medium">Python Support Coming Soon</div>
            <div class="text-yellow-500 text-sm mt-1">Python parsing is not yet implemented</div>
          </div>
        </div>
      `);
      setError('');
      setIsRendering(false);
      return;
    }

    setIsRendering(true);
    setError('');

    try {
      // Wait a bit to ensure mermaid is initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate a unique ID for this diagram
      const currentId = diagramId.current;
      
      // Validate and render the mermaid diagram
              const isValid = await mermaid.parse(mermaidCode);
        if (isValid) {
          const { svg } = await mermaid.render(currentId, mermaidCode);
          setSvgContent(svg);
          // Notify parent component that SVG is ready
          if (onSvgReady) {
            onSvgReady(svg);
          }
        } else {
        throw new Error('Invalid mermaid syntax');
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      setError((error as Error).message);
      setSvgContent('');
    } finally {
      setIsRendering(false);
    }
  }, [mermaidCode]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Diagram Preview</span>
      </div>
      <div className="bg-white p-4 min-h-[400px] overflow-auto">
        <div className="w-full h-full flex items-center justify-center">
          {isRendering && (
            <div className="text-gray-500 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-sm">Rendering diagram...</div>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-64 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="text-center">
                <div className="text-red-600 text-lg font-medium">Diagram Rendering Error</div>
                <div className="text-red-500 text-sm mt-1">Unable to render the diagram. Please check the code.</div>
                <div className="text-red-400 text-xs mt-2">{error}</div>
              </div>
            </div>
          )}
          {svgContent && !isRendering && !error && (
            <div 
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
          {!mermaidCode && !isRendering && !error && !svgContent && (
            <div className="text-gray-500 text-center">
              <div className="text-lg font-medium">No diagram yet</div>
              <div className="text-sm mt-1">Enter code and click convert to see the diagram</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagramViewer;