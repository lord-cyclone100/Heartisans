import { useTranslation } from 'react-i18next';

export const useContentTranslation = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';

  // Translate category names
  const translateCategory = (category) => {
    if (!category) return '';
    
    // Convert category to key format
    const categoryKey = `category.${category.toLowerCase().replace(/\s+/g, '')}`;
    
    // Return translation if exists, otherwise return original
    const translation = t(categoryKey);
    return translation === categoryKey ? category : translation;
  };

  // Translate state names
  const translateState = (state) => {
    if (!state) return '';
    
    // Convert state to key format, handle special cases for Tamil Nadu
    let stateKey;
    const normalizedState = state.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedState.includes('tamil') || normalizedState.includes('tamilnadu')) {
      stateKey = 'state.tamilnadu';
    } else {
      stateKey = `state.${normalizedState}`;
    }
    
    // Return translation if exists, otherwise return original
    const translation = t(stateKey);
    return translation === stateKey ? state : translation;
  };

  // For future database fields with multiple language support
  const getTranslatedField = (fieldObject, fallbackLanguage = 'en') => {
    if (!fieldObject || typeof fieldObject !== 'object') {
      return fieldObject; // Return as-is if not an object
    }
    
    // Try current language, then fallback language, then first available
    return fieldObject[currentLanguage] || 
           fieldObject[fallbackLanguage] || 
           Object.values(fieldObject)[0] || 
           '';
  };

  // Translate product object with existing database structure
  const translateProduct = (product) => {
    if (!product) return product;
    
    return {
      ...product,
      translatedCategory: translateCategory(product.category),
      translatedState: translateState(product.state),
      // These will be useful when we upgrade to multi-language database
      displayName: getTranslatedField(product.name) || product.name,
      displayDescription: getTranslatedField(product.description) || product.description,
    };
  };

  return { 
    translateCategory, 
    translateState, 
    getTranslatedField, 
    translateProduct,
    currentLanguage 
  };
};
