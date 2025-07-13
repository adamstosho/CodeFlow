import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Diagram } from '../../types';
import { diagramApi } from '../../services/api';
import DiagramViewer from '../Convert/DiagramViewer';
import { ArrowLeft, Calendar, Code, Download, Share2, Eye, EyeOff, Trash2, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ShareModal from '../Share/ShareModal';

const DiagramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState<'javascript' | 'python'>('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentSvgContent, setCurrentSvgContent] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDiagram(id);
    }
  }, [id]);

  const loadDiagram = async (diagramId: string) => {
    try {
      const response = await diagramApi.getById(diagramId);
      if (response.success) {
        setDiagram(response.diagram);
        setEditCode(response.diagram.code);
        setEditLanguage(response.diagram.language);
      } else {
        setError('Diagram not found');
      }
    } catch (error) {
      setError('Failed to load diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!diagram) return;

    setIsExporting(true);
    try {
      if (currentSvgContent) {
        // Use the current SVG content from the DiagramViewer
        const blob = new Blob([currentSvgContent], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram-${diagram._id}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Diagram exported successfully!');
      } else {
        // Fallback to backend export if frontend SVG is not available
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
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleShare = async () => {
    if (!diagram) return;

    try {
      const response = await diagramApi.toggleShare(diagram._id, !diagram.shared);
      if (response.success) {
        setDiagram({ ...diagram, shared: !diagram.shared });
        toast.success(`Diagram ${!diagram.shared ? 'shared' : 'made private'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to update sharing status');
    }
  };

  const handleDelete = async () => {
    if (!diagram) return;

    if (window.confirm('Are you sure you want to delete this diagram?')) {
      try {
        await diagramApi.delete(diagram._id);
        toast.success('Diagram deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete diagram');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditCode(diagram?.code || '');
    setEditLanguage(diagram?.language || 'javascript');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditCode(diagram?.code || '');
    setEditLanguage(diagram?.language || 'javascript');
  };

  const handleSave = async () => {
    if (!diagram || !editCode.trim()) return;

    setIsSaving(true);
    try {
      const response = await diagramApi.update(diagram._id, {
        code: editCode.trim(),
        language: editLanguage,
      });
      
      if (response.success) {
        setDiagram(response.diagram);
        setIsEditing(false);
        toast.success('Diagram updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !diagram) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl font-medium mb-4">
          {error || 'Diagram not found'}
        </div>
        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-base sm:text-lg">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Diagram Details</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
            <button
              onClick={handleToggleShare}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                diagram.shared
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {diagram.shared ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{diagram.shared ? 'Public' : 'Private'}</span>
            </button>
            {diagram.shared && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? 'Exporting...' : 'Export SVG'}</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 mt-2">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              diagram.language === 'javascript' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {diagram.language}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(diagram.createdAt)}</span>
          </div>
          <div className="text-xs break-all">
            ID: {diagram._id}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Source Code</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value as 'javascript' | 'python')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <textarea
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Enter your code here..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-4 overflow-auto">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                {diagram.code}
              </pre>
            </div>
          )}
        </div>

        {/* Diagram Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Diagram</h2>
          {diagram.mermaid ? (
            <DiagramViewer 
              key={diagram._id} 
              mermaidCode={diagram.mermaid} 
              onSvgReady={setCurrentSvgContent}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <div className="text-center">
                <div className="text-gray-600 text-lg font-medium">No diagram available</div>
                <div className="text-gray-500 text-sm mt-1">The diagram could not be loaded</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {diagram.shared && (
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

export default DiagramDetailPage;