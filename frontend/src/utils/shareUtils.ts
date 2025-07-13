/**
 * Utility functions for sharing diagrams
 */

/**
 * Generate a shareable URL for a diagram that works with HashRouter
 * @param diagramId - The diagram ID
 * @returns The complete shareable URL
 */
export const generateShareUrl = (diagramId: string): string => {
  const baseUrl = window.location.origin;
  const hashPath = `#/share/${diagramId}`;
  return `${baseUrl}${hashPath}`;
};

/**
 * Generate a shareable URL for a diagram with custom base URL
 * @param diagramId - The diagram ID
 * @param baseUrl - Custom base URL (optional)
 * @returns The complete shareable URL
 */
export const generateShareUrlWithBase = (diagramId: string, baseUrl?: string): string => {
  const url = baseUrl || window.location.origin;
  const hashPath = `#/share/${diagramId}`;
  return `${url}${hashPath}`;
};

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    // Use modern clipboard API
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      throw new Error('Failed to copy text');
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/**
 * Generate social media share URLs
 */
export const getSocialShareUrls = (url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent('Code Diagram Shared')}&body=${encodedTitle}%20${encodedUrl}`,
  };
};

/**
 * Check if native sharing is available
 */
export const isNativeSharingSupported = (): boolean => {
  return 'share' in navigator && 'canShare' in navigator;
};

/**
 * Share using native Web Share API
 */
export const nativeShare = async (data: {
  title: string;
  text: string;
  url: string;
}): Promise<void> => {
  if (!isNativeSharingSupported()) {
    throw new Error('Native sharing not supported');
  }
  
  await navigator.share(data);
}; 