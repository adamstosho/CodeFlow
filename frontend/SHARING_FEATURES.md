# Sharing Features

This document explains the sharing functionality implemented in the Code-to-Diagram Converter frontend.

## Overview

The sharing system allows users to share their code diagrams with others through various platforms while properly handling HashRouter URLs.

## How It Works

### HashRouter Compatibility
- The app uses HashRouter (`#/`) for client-side routing
- Share URLs are generated as: `https://yourdomain.com/#/share/{diagramId}`
- This ensures compatibility with static hosting and proper routing

### Sharing Flow
1. User creates a diagram and sets it to "public" (shared: true)
2. User clicks the share button on the diagram card
3. Share modal opens with multiple sharing options
4. User can copy the link or share directly to social media

## Share Modal Features

### Copy Link
- Displays the complete shareable URL
- One-click copy to clipboard with visual feedback
- Works with HashRouter URLs

### Social Media Sharing
- **WhatsApp**: Opens WhatsApp with pre-filled message
- **Facebook**: Opens Facebook share dialog
- **Twitter**: Opens Twitter compose with pre-filled tweet
- **LinkedIn**: Opens LinkedIn share dialog
- **Email**: Opens default email client with pre-filled content

### Native Sharing (Mobile)
- Uses Web Share API when available
- Provides native sharing options on mobile devices
- Falls back gracefully on unsupported browsers

## Technical Implementation

### URL Generation
```typescript
// Proper HashRouter URL generation
const generateShareUrl = (diagramId: string): string => {
  const baseUrl = window.location.origin;
  const hashPath = `#/share/${diagramId}`;
  return `${baseUrl}${hashPath}`;
};
```

### Clipboard Handling
- Modern browsers: Uses `navigator.clipboard.writeText()`
- Fallback: Uses `document.execCommand('copy')` for older browsers
- Secure context detection for clipboard API

### Social Media URLs
- Properly encoded URLs and text
- Opens in popup windows for better UX
- Handles all major social platforms

## Usage Examples

### Basic Sharing
1. Make a diagram public by clicking the eye icon
2. Click the share button (green when public)
3. Choose your preferred sharing method

### Direct Link Sharing
1. Copy the share link from the modal
2. Paste it anywhere (WhatsApp, email, etc.)
3. Recipients can view the diagram without logging in

### Social Media Integration
- Click any social media button in the share modal
- The platform will open with pre-filled content
- Share with your network

## Security Considerations

- Only public diagrams (shared: true) can be shared
- Private diagrams show an error message when trying to share
- Share URLs are public but require the diagram to be marked as shared
- No authentication required to view shared diagrams

## Browser Compatibility

- **Modern browsers**: Full clipboard API support
- **Older browsers**: Fallback clipboard method
- **Mobile browsers**: Native sharing API support
- **All browsers**: Social media sharing works

## Troubleshooting

### Link Not Working
- Ensure the diagram is marked as public
- Check that the URL includes the `#/share/` hash
- Verify the diagram ID is correct

### Copy Not Working
- Check if the site is served over HTTPS (required for clipboard API)
- Try refreshing the page
- Use the fallback method on older browsers

### Social Media Not Opening
- Check if popup blockers are enabled
- Ensure the platform URL is accessible
- Try opening in a new tab manually 