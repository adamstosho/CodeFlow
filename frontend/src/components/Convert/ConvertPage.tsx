import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import DiagramViewer from './DiagramViewer';
import { convertApi, diagramApi } from '../../services/api';
import { Play, Download, Share2, Eye, EyeOff, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const ConvertPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [mermaidCode, setMermaidCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentSvgContent, setCurrentSvgContent] = useState<string>('');
  const navigate = useNavigate();

  const handleConvert = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }

    setIsConverting(true);
    try {
      const response = await convertApi.convert({ code, language, shared: isShared });
      if (response.success) {
        setMermaidCode(response.mermaid);
        // Set diagram ID if one was created
        if (response.diagramId) {
          setCurrentDiagramId(response.diagramId);
        }
        toast.success('Code converted successfully!');
      } else {
        toast.error('Conversion failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSave = async () => {
    if (!mermaidCode || !code.trim()) {
      toast.error('Please convert some code first');
      return;
    }

    setIsSaving(true);
    try {
      if (currentDiagramId && !currentDiagramId.startsWith('temp-')) {
        // Update existing diagram
        const response = await diagramApi.update(currentDiagramId, {
          code: code.trim(),
          language,
          shared: isShared,
        });
        if (response.success) {
          toast.success('Diagram updated successfully!');
        }
      } else {
        // Create new diagram
        const response = await convertApi.convert({ 
          code: code.trim(), 
          language, 
          shared: isShared 
        });
        if (response.success) {
          if (response.diagramId) {
            setCurrentDiagramId(response.diagramId);
            toast.success('Diagram saved successfully!');
          } else {
            toast.success('Code converted successfully!');
          }
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!mermaidCode) {
      toast.error('No diagram to export');
      return;
    }

    try {
      if (currentSvgContent) {
        // Use the current SVG content from the DiagramViewer
        const blob = new Blob([currentSvgContent], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram-${currentDiagramId || Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Diagram exported successfully!');
      } else {
        // Fallback to backend export
        const blob = await diagramApi.exportSvg(mermaidCode);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram-${currentDiagramId || Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Diagram exported successfully!');
      }
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleShare = () => {
    if (currentDiagramId) {
      const shareUrl = `${window.location.origin}/share/${currentDiagramId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const sampleCode = {
    javascript: `function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function main() {
    const result = fibonacci(5);
    console.log(result);
}`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    result = fibonacci(5)
    print(result)`
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-0">Code to Diagram Converter</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Convert your JavaScript or Python code into visual flowcharts using Mermaid.js
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <button
                    onClick={() => setIsShared(!isShared)}
                    className={`flex items-center space-x-2 px-3 py-2 border rounded-md transition-colors ${
                      isShared
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    {isShared ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span>{isShared ? 'Public' : 'Private'}</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setCode(sampleCode[language])}
                className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors w-full sm:w-auto"
              >
                Load Sample
              </button>
            </div>
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConverting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>{currentDiagramId ? 'Update Diagram' : 'Convert to Diagram'}</span>
                </>
              )}
            </button>

            {mermaidCode && (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : (currentDiagramId ? 'Update' : 'Save')}</span>
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Export SVG</span>
                </button>

                {isShared && currentDiagramId && (
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <DiagramViewer 
            mermaidCode={mermaidCode} 
            onSvgReady={setCurrentSvgContent}
          />
        </div>
      </div>
    </div>
  );
};

export default ConvertPage;