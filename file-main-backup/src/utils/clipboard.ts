/**
 * Copy text to clipboard with fallback for blocked Clipboard API
 * @param text - The text to copy
 * @returns Promise that resolves when copy is successful
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      // Fallback to legacy method if Clipboard API fails
      return fallbackCopyText(text);
    }
  }
  
  // Use fallback method directly if Clipboard API is not available
  return fallbackCopyText(text);
};

/**
 * Fallback copy method using legacy execCommand
 * @param text - The text to copy
 */
const fallbackCopyText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('Copy command failed'));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  });
};
