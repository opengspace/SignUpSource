import { useState, useEffect } from 'react';

/**
 * Hook for using SignUpSource in any React application
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.id - Website ID for tracking
 * @param {string} options.title - Modal title
 * @param {string} options.description - Modal description
 * @param {string} options.buttonText - Submit button text
 * @param {Array} options.checkItems - Array of items users can select
 * @param {Function} options.callback - Callback function when user submits selections
 * @param {boolean} options.showOnlyOnce - Whether to show the modal only once per user
 * @param {string} options.apiEndpoint - API endpoint to send data to
 * @param {string} options.apiMethod - HTTP method (POST or GET)
 * @param {Object} options.apiHeaders - Custom headers for API request
 * @param {boolean} options.storeLocal - Store data in localStorage
 * @param {string} options.localStorageKey - Key for localStorage
 * @param {string} options.language - Language: 'en', 'zh', 'ja', 'auto' (default: 'auto')
 * @param {Object} options.translations - Custom translations
 * @returns {Object} - Hook return object
 */
const useSignUpSource = (options = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  
  const {
    id = '',
    title = '',
    description = '',
    buttonText = '',
    checkItems = [],
    callback,
    showOnlyOnce = true,
    apiEndpoint = '',
    apiMethod = 'POST',
    apiHeaders = {},
    storeLocal = false,
    localStorageKey = 'signupsource_data',
    language = 'auto',
    translations = {}
  } = options;

  // Get detected language
  const getLanguage = () => {
    if (language !== 'auto') return language;
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('ja')) return 'ja';
    return 'en';
  };

  const detectedLang = getLanguage();

  // Check if the user is new
  useEffect(() => {
    const isReturningUser = localStorage.getItem('signupsource_returning_user');
    
    if (!isReturningUser && !hasShown) {
      setIsOpen(true);
      setHasShown(true);
    }
  }, [hasShown]);

  // Function to send data to API endpoint
  const sendToApi = async (data) => {
    if (!apiEndpoint) return false;

    try {
      const payload = {
        websiteId: id,
        sources: data,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        language: detectedLang
      };

      const fetchOptions = {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          ...apiHeaders
        }
      };

      if (apiMethod === 'POST') {
        fetchOptions.body = JSON.stringify(payload);
      }

      const response = await fetch(apiEndpoint, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('SignUpSource: Data sent to API successfully');
      return true;
    } catch (error) {
      console.error('SignUpSource: Failed to send data to API:', error);
      return false;
    }
  };

  // Function to store data locally
  const storeLocally = (data) => {
    if (!storeLocal) return false;

    try {
      const existingData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
      const newEntry = {
        websiteId: id,
        sources: data,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        language: detectedLang
      };
      existingData.push(newEntry);
      localStorage.setItem(localStorageKey, JSON.stringify(existingData));
      console.log('SignUpSource: Data stored locally');
      return true;
    } catch (error) {
      console.error('SignUpSource: Failed to store data locally:', error);
      return false;
    }
  };

  // Handle modal closing
  const closeModal = () => {
    setIsOpen(false);
    
    if (showOnlyOnce) {
      localStorage.setItem('signupsource_returning_user', 'true');
    }
  };

  // Handle user selections
  const handleSubmit = async (selectedItems) => {
    const submissionData = {
      websiteId: id,
      sources: selectedItems,
      timestamp: new Date().toISOString(),
      language: detectedLang
    };
    
    if (callback && typeof callback === 'function') {
      callback(submissionData);
    }
    
    if (apiEndpoint) {
      await sendToApi(selectedItems);
    }
    
    if (storeLocal) {
      storeLocally(selectedItems);
    }

    if (!callback && !apiEndpoint && !storeLocal) {
      console.log('SignUpSource:', submissionData);
    }
    
    closeModal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const resetUser = () => {
    localStorage.removeItem('signupsource_returning_user');
    setHasShown(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    resetUser,
    modalProps: {
      id,
      title,
      description,
      buttonText,
      checkItems,
      callback: handleSubmit,
      isOpen,
      onClose: closeModal,
      apiEndpoint,
      apiMethod,
      apiHeaders,
      storeLocal,
      localStorageKey,
      language,
      translations
    }
  };
};

export default useSignUpSource;
