import React, { useState } from 'react';
import { Diagram } from '../../types';
import { Calendar, Code, Eye, EyeOff, Share2, Trash2, ExternalLink } from 'lucide-react';
import ShareModal from '../Share/ShareModal';
import toast from 'react-hot-toast';

interface DiagramCardProps {
  diagram: Diagram;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, shared: boolean) => void;
  onView: (id: string) => void;
}

const DiagramCard: React.FC<DiagramCardProps> = ({ diagram, onDelete, onToggleShare, onView }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLanguageColor = (language: string) => {
    return language === 'javascript' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLanguageColor(diagram.language)}`}>
            <Code className="h-3 w-3 mr-1" />
            {diagram.language}
          </span>
          <button
            onClick={() => onToggleShare(diagram._id, !diagram.shared)}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${diagram.shared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
            {diagram.shared ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
            {diagram.shared ? 'Public' : 'Private'}
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(diagram._id)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
            title="View diagram"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (!diagram.shared) {
                toast.error('Make diagram public first to share it');
                return;
              }
              setShowShareModal(true);
            }}
            className={`p-1.5 transition-colors ${diagram.shared
              ? 'text-green-600 hover:text-green-700'
              : 'text-gray-400 hover:text-green-600'
              }`}
            title={diagram.shared ? "Share diagram" : "Make diagram public to share"}
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(diagram._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete diagram"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Code Preview</h3>
        <div className="bg-gray-50 rounded-md p-3">
          <code className="text-sm text-gray-700 font-mono">
            {diagram.code.length > 100 ? `${diagram.code.substring(0, 100)}...` : diagram.code}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(diagram.createdAt)}</span>
        </div>
        <div className="text-xs">
          ID: {diagram._id.substring(0, 8)}...
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        diagramId={diagram._id}
        diagramTitle={`Code Diagram - ${diagram.language}`}
      />
    </div>
  );
};

export default DiagramCard;