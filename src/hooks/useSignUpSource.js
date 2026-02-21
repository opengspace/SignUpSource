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
 * @returns {Object} - Hook return object
 */
const useSignUpSource = (options = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  
  const {
    id = '',
    title = 'Where did you hear about us?',
    description = 'Please let us know how you found our website.',
    buttonText = 'Submit',
    checkItems = [
      { id: 'google', label: 'Google Search' },
      { id: 'social', label: 'Social Media' },
      { id: 'friend', label: 'Friend Recommendation' },
      { id: 'blog', label: 'Blog or Article' },
      { id: 'other', label: 'Other' }
    ],
    callback,
    showOnlyOnce = true,
    apiEndpoint = '',
    apiMethod = 'POST',
    apiHeaders = {},
    storeLocal = false,
    localStorageKey = 'signupsource_data'
  } = options;

  // Check if the user is new
  useEffect(() => {
    const isReturningUser = localStorage.getItem('signupsource_returning_user');
    
    if (!isReturningUser && !hasShown) {
      // Open modal for new users
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
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      };

      const options = {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          ...apiHeaders
        }
      };

      if (apiMethod === 'POST') {
        options.body = JSON.stringify(payload);
      }

      const response = await fetch(apiEndpoint, options);
      
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
        url: typeof window !== 'undefined' ? window.location.href : ''
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
    
    // If showOnlyOnce is true, mark the user as returning
    if (showOnlyOnce) {
      localStorage.setItem('signupsource_returning_user', 'true');
    }
  };

  // Handle user selections
  const handleSubmit = async (selectedItems) => {
    const submissionData = {
      websiteId: id,
      sources: selectedItems,
      timestamp: new Date().toISOString()
    };
    
    // Call the provided callback
    if (callback && typeof callback === 'function') {
      callback(submissionData);
    }
    
    // Send to API if configured
    if (apiEndpoint) {
      await sendToApi(selectedItems);
    }
    
    // Store locally if enabled
    if (storeLocal) {
      storeLocally(selectedItems);
    }

    // Default behavior - log to console if no API and no callback
    if (!callback && !apiEndpoint && !storeLocal) {
      console.log('SignUpSource: Sending data to server');
      console.log('Website ID:', id);
      console.log('User checked items:', selectedItems);
    }
    
    // Close the modal
    closeModal();
  };

  // For testing purposes - open the modal manually
  const openModal = () => {
    setIsOpen(true);
  };

  // Reset the user's status (for testing)
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
      localStorageKey
    }
  };
};

export default useSignUpSource;
