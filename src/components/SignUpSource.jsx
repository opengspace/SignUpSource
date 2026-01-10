import React, { useState, useEffect, useRef } from 'react';
import './SignUpSource.css';

/**
 * SignUpSource component displays a modal to collect information about how users found the website
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Website ID for tracking
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @param {string} props.buttonText - Submit button text
 * @param {Array} props.checkItems - Array of items users can select
 * @param {Function} props.callback - Callback function when user submits selections
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 */
const SignUpSource = ({ 
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
  isOpen,
  onClose
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [otherSource, setOtherSource] = useState('');
  const otherInputRef = useRef(null);

  // Reset selected items when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
      setOtherSource('');
    }
  }, [isOpen]);

  // Focus on the "Other" input field when it's selected
  useEffect(() => {
    if (selectedItems.some(item => item.id === 'other') && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [selectedItems]);

  // Handle background click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
      // Clear other source if "Other" is unchecked
      if (item.id === 'other') {
        setOtherSource('');
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    let itemsToSend = [...selectedItems];
    
    // Replace the "Other" item with custom label if provided
    if (selectedItems.some(item => item.id === 'other') && otherSource.trim() !== '') {
      itemsToSend = itemsToSend.map(item => {
        if (item.id === 'other') {
          return { ...item, customLabel: otherSource.trim(), label: `Other: ${otherSource.trim()}` };
        }
        return item;
      });
    }
    
    if (callback && typeof callback === 'function') {
      callback(itemsToSend);
    } else {
      // Default behavior - log to console
      console.log('SignUpSource: Sending data to server');
      console.log('Website ID:', id);
      console.log('User checked items:', itemsToSend);
      
      // Simulate sending data to server
      setTimeout(() => {
        console.log('SignUpSource: Data sent successfully');
      }, 500);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="signupsource-modal" onClick={handleBackdropClick}>
      <div className="signupsource-modal-content">
        <h2 className="signupsource-title">{title}</h2>
        <p className="signupsource-description">{description}</p>
        
        <div className="signupsource-check-items">
          {checkItems.map((item) => (
            <div key={item.id} className="signupsource-check-item">
              <input
                type="checkbox"
                id={`signupsource-${item.id}`}
                checked={selectedItems.some(i => i.id === item.id)}
                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              />
              <label htmlFor={`signupsource-${item.id}`}>{item.label}</label>
              
              {/* Add text input for "Other" option */}
              {item.id === 'other' && selectedItems.some(i => i.id === 'other') && (
                <input
                  type="text"
                  ref={otherInputRef}
                  className="signupsource-other-input"
                  placeholder="Please specify"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        
        <button 
          className="signupsource-button"
          onClick={handleSubmit}
          disabled={selectedItems.some(item => item.id === 'other') && otherSource.trim() === ''}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SignUpSource; 