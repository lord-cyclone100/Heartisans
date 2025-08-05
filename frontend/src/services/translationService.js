import axios from 'axios';

// Google Translate API service
class TranslationService {
  constructor() {
    this.apiKey = process.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseURL = 'https://translation.googleapis.com/language/translate/v2';
    this.detectionURL = 'https://translation.googleapis.com/language/translate/v2/detect';
  }

  // Detect language of text
  async detectLanguage(text) {
    try {
      const response = await axios.post(`${this.detectionURL}?key=${this.apiKey}`, {
        q: text
      });

      return response.data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  // Translate text
  async translateText(text, targetLang, sourceLang = 'auto') {
    try {
      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
        q: text,
        target: targetLang,
        source: sourceLang === 'auto' ? undefined : sourceLang,
        format: 'text'
      });

      return {
        translatedText: response.data.data.translations[0].translatedText,
        detectedSourceLanguage: response.data.data.translations[0].detectedSourceLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      return { translatedText: text, detectedSourceLanguage: sourceLang };
    }
  }

  // Translate multiple texts at once
  async translateBatch(texts, targetLang, sourceLang = 'auto') {
    try {
      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
        q: texts,
        target: targetLang,
        source: sourceLang === 'auto' ? undefined : sourceLang,
        format: 'text'
      });

      return response.data.data.translations.map(translation => ({
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      }));
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts.map(text => ({ translatedText: text, detectedSourceLanguage: sourceLang }));
    }
  }

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await axios.get(`https://translation.googleapis.com/language/translate/v2/languages?key=${this.apiKey}`);
      return response.data.data.languages;
    } catch (error) {
      console.error('Supported languages error:', error);
      return [];
    }
  }

  // Client-side page translation using Google Translate Widget
  initializeGoogleTranslateWidget() {
    // Load Google Translate script if not already loaded
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);

      // Initialize Google Translate Element
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'ar,hi,ur,bn,te,ta,ml,kn,gu,pa,mr,od,as,fr,es,de,it,pt,ru,ja,ko,zh,th,vi,id,ms,tr,he,fa,sw,am,yo,ig,ha',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
      };
    }
  }

  // Trigger translation using Google Translate Widget
  triggerTranslation(targetLang) {
    if (window.google && window.google.translate) {
      const translateElement = window.google.translate.TranslateElement.getInstance();
      if (translateElement) {
        translateElement.translate('en', targetLang);
      }
    }
  }

  // Show original content
  showOriginal() {
    if (window.google && window.google.translate) {
      const translateElement = window.google.translate.TranslateElement.getInstance();
      if (translateElement) {
        translateElement.translate('', 'en');
      }
    }
  }

  // Clean up Google Translate artifacts
  cleanupTranslateArtifacts() {
    // Remove Google Translate top bar
    const gtBars = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
    gtBars.forEach(bar => bar.remove());

    // Reset body margin if Google Translate added it
    document.body.style.marginTop = '0';
    document.body.style.top = 'auto';

    // Remove translation artifacts from body classes
    document.body.classList.remove('translated-ltr', 'translated-rtl');
  }

  // Advanced page translation with better UX
  async translatePage(targetLang, options = {}) {
    const {
      preserveFormatting = true,
      translateImages = false,
      translatePlaceholders = true
    } = options;

    try {
      // Get all text nodes
      const textNodes = this.getTextNodes(document.body);
      const textsToTranslate = textNodes
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0 && !/^\d+$/.test(text)); // Exclude numbers only

      if (textsToTranslate.length === 0) return;

      // Translate in batches
      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        batches.push(textsToTranslate.slice(i, i + batchSize));
      }

      let translatedTexts = [];
      for (const batch of batches) {
        const translations = await this.translateBatch(batch, targetLang);
        translatedTexts = translatedTexts.concat(translations.map(t => t.translatedText));
      }

      // Apply translations
      let textIndex = 0;
      textNodes.forEach(node => {
        const originalText = node.textContent.trim();
        if (originalText.length > 0 && !/^\d+$/.test(originalText)) {
          node.textContent = translatedTexts[textIndex] || originalText;
          textIndex++;
        }
      });

      // Translate placeholders if requested
      if (translatePlaceholders) {
        await this.translatePlaceholders(targetLang);
      }

      // Translate alt texts if requested
      if (translateImages) {
        await this.translateImageAlts(targetLang);
      }

    } catch (error) {
      console.error('Page translation error:', error);
    }
  }

  // Get all text nodes in an element
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and other non-visible elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'iframe'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip if parent is hidden
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    return textNodes;
  }

  // Translate input placeholders
  async translatePlaceholders(targetLang) {
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    const placeholders = Array.from(inputs).map(input => input.placeholder);
    
    if (placeholders.length > 0) {
      const translations = await this.translateBatch(placeholders, targetLang);
      inputs.forEach((input, index) => {
        if (translations[index]) {
          input.placeholder = translations[index].translatedText;
        }
      });
    }
  }

  // Translate image alt texts
  async translateImageAlts(targetLang) {
    const images = document.querySelectorAll('img[alt]');
    const altTexts = Array.from(images).map(img => img.alt);
    
    if (altTexts.length > 0) {
      const translations = await this.translateBatch(altTexts, targetLang);
      images.forEach((img, index) => {
        if (translations[index]) {
          img.alt = translations[index].translatedText;
        }
      });
    }
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default TranslationService;