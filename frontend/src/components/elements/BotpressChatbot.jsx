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
