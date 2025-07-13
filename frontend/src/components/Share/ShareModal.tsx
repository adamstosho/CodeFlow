import React, { useState } from 'react';
import { X, Copy, Share2, MessageCircle, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateShareUrl, copyToClipboard, getSocialShareUrls, isNativeSharingSupported, nativeShare } from '../../utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramId: string;
  diagramTitle?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, diagramId, diagramTitle = 'Code Diagram' }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = generateShareUrl(diagramId);

  const handleCopyToClipboard = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const socialUrls = getSocialShareUrls(shareUrl, `Check out this code diagram: ${diagramTitle}`);
    const socialShareUrl = socialUrls[platform as keyof typeof socialUrls];
    
    if (socialShareUrl) {
      window.open(socialShareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Share Diagram</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Share URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm bg-gray-50"
              />
                              <button
                  onClick={handleCopyToClipboard}
                  className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-md transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-700 border-green-300' 
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Share to:</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => shareToSocialMedia('whatsapp')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">WhatsApp</span>
              </button>

              <button
                onClick={() => shareToSocialMedia('facebook')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span className="text-sm">Facebook</span>
              </button>

              <button
                onClick={() => shareToSocialMedia('twitter')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="text-sm">Twitter</span>
              </button>

              <button
                onClick={() => shareToSocialMedia('linkedin')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="text-sm">LinkedIn</span>
              </button>
            </div>

            <button
              onClick={() => shareToSocialMedia('email')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Email</span>
            </button>
          </div>

          {/* Native Share API (if available) */}
          {isNativeSharingSupported() && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={async () => {
                  try {
                    await nativeShare({
                      title: diagramTitle,
                      text: `Check out this code diagram: ${diagramTitle}`,
                      url: shareUrl,
                    });
                  } catch (error: any) {
                    if (error.name !== 'AbortError') {
                      toast.error('Failed to share');
                    }
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share (Native)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 