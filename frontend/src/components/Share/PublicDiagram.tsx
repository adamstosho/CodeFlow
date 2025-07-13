import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Diagram } from '../../types';
import { diagramApi } from '../../services/api';
import DiagramViewer from '../Convert/DiagramViewer';
import { ArrowLeft, Calendar, Code, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';

const PublicDiagram: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDiagram(id);
    }
  }, [id]);

  const loadDiagram = async (diagramId: string) => {
    try {
      const response = await diagramApi.getPublic(diagramId);
      if (response.success) {
        setDiagram(response.diagram);
      } else {
        setError('Diagram not found or not shared');
      }
    } catch (error) {
      setError('Failed to load diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!diagram) return;

    try {
      const blob = await diagramApi.exportSvg(diagram.mermaid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-${diagram._id}.svg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Diagram exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !diagram) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-medium mb-4">
            {error || 'Diagram not found'}
          </div>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Shared Diagram</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Code</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  diagram.language === 'javascript' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Code className="h-3 w-3 mr-1" />
                  {diagram.language}
                </span>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                  {diagram.code}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(diagram.createdAt)}</span>
                </div>
                <div className="text-xs">
                  ID: {diagram._id}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <DiagramViewer mermaidCode={diagram.mermaid} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {diagram && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          diagramId={diagram._id}
          diagramTitle={`Code Diagram - ${diagram.language}`}
        />
      )}
    </div>
  );
};

export default PublicDiagram;