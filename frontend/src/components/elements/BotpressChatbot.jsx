import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const BotpressChatbot = () => {
  const location = useLocation();

  // Don't render chatbot on home page
  if (location.pathname === '/') {
    return null;
  }

  useEffect(() => {
    // Only load once globally
    if (window.botpressWebChatLoaded) {
      return;
    }

    // Store original font size to restore it
    const originalFontSize = document.documentElement.style.fontSize || '62.5%';

    const loadBotpressScripts = () => {
      // Remove any existing scripts first
      const existingInject = document.getElementById('botpress-webchat-inject');
      const existingConfig = document.getElementById('botpress-webchat-config');
      
      if (existingInject) existingInject.remove();
      if (existingConfig) existingConfig.remove();

      // Create and load inject script
      const injectScript = document.createElement('script');
      injectScript.id = 'botpress-webchat-inject';
      injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
      injectScript.defer = true;

      injectScript.onload = () => {
        console.log('Botpress inject script loaded');
        
        // Load config script after inject script loads
        const configScript = document.createElement('script');
        configScript.id = 'botpress-webchat-config';
        configScript.src = 'https://files.bpcontent.cloud/2025/07/19/07/20250719074258-8PY8811H.js';
        configScript.defer = true;
        
        configScript.onload = () => {
          console.log('Botpress config script loaded');
          
          // Restore our font-size after chatbot loads
          setTimeout(() => {
            document.documentElement.style.fontSize = originalFontSize;
            // Force maintain our custom font size
            const style = document.createElement('style');
            style.innerHTML = `
              html { 
                font-size: 62.5% !important; 
              }
              /* Isolate chatbot styles */
              [id*="bp-web-widget"], [class*="bp-"], [id*="botpress"] {
                font-size: 16px !important;
                line-height: 1.4 !important;
              }
            `;
            document.head.appendChild(style);
          }, 100);
          
          window.botpressWebChatLoaded = true;
        };
        
        configScript.onerror = () => {
          console.error('Failed to load Botpress config script');
        };
        
        document.head.appendChild(configScript);
      };

      injectScript.onerror = () => {
        console.error('Failed to load Botpress inject script');
      };

      document.head.appendChild(injectScript);
    };

    // Load scripts with a small delay
    const timer = setTimeout(loadBotpressScripts, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Only run once on mount

  return null;
};
