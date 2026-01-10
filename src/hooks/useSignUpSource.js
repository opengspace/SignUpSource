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
    showOnlyOnce = true
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

  // Handle modal closing
  const closeModal = () => {
    setIsOpen(false);
    
    // If showOnlyOnce is true, mark the user as returning
    if (showOnlyOnce) {
      localStorage.setItem('signupsource_returning_user', 'true');
    }
  };

  // Handle user selections
  const handleSubmit = (selectedItems) => {
    // Call the provided callback
    if (callback && typeof callback === 'function') {
      callback(selectedItems);
    } else {
      // Default behavior - send to server
      console.log('SignUpSource: Sending data to server');
      console.log('Website ID:', id);
      console.log('User checked items:', selectedItems);
      
      // Simulate sending data to server
      setTimeout(() => {
        console.log('SignUpSource: Data sent successfully');
      }, 500);
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
      onClose: closeModal
    }
  };
};

export default useSignUpSource; 