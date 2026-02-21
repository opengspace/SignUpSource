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
 * @param {string} props.apiEndpoint - API endpoint to send data to
 * @param {string} props.apiMethod - HTTP method (POST or GET), default POST
 * @param {Object} props.apiHeaders - Custom headers for API request
 * @param {boolean} props.storeLocal - Store data in localStorage
 * @param {string} props.localStorageKey - Key for localStorage, default 'signupsource_data'
 * @param {string} props.language - Language code: 'en', 'zh', 'ja', 'auto' (default: 'auto')
 * @param {Object} props.translations - Custom translations override
 */
const SignUpSource = ({ 
  id = '',
  title = '',
  description = '',
  buttonText = '',
  checkItems = [],
  callback,
  isOpen,
  onClose,
  apiEndpoint = '',
  apiMethod = 'POST',
  apiHeaders = {},
  storeLocal = false,
  localStorageKey = 'signupsource_data',
  language = 'auto',
  translations = {}
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [otherSource, setOtherSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otherInputRef = useRef(null);

  // Default translations
  const defaultTranslations = {
    en: {
      title: 'Where did you hear about us?',
      description: 'Please let us know how you found our website.',
      buttonText: 'Submit',
      placeholder: 'Please specify',
      sending: 'Sending...',
      defaultCheckItems: [
        { id: 'google', label: 'Google Search' },
        { id: 'social', label: 'Social Media' },
        { id: 'friend', label: 'Friend Recommendation' },
        { id: 'blog', label: 'Blog or Article' },
        { id: 'other', label: 'Other' }
      ]
    },
    zh: {
      title: '您是从哪里了解到我们的？',
      description: '请告诉我们您是如何找到我们的网站的。',
      buttonText: '提交',
      placeholder: '请输入其他来源',
      sending: '提交中...',
      defaultCheckItems: [
        { id: 'google', label: '谷歌搜索' },
        { id: 'social', label: '社交媒体' },
        { id: 'friend', label: '朋友推荐' },
        { id: 'blog', label: '博客或文章' },
        { id: 'other', label: '其他' }
      ]
    },
    ja: {
      title: 'どこで私たちを知りましたか？',
      description: 'どのように 우리 사이트를 찾으셨는지 알려주세요.',
      buttonText: '送信',
      placeholder: '具体的に入力',
      sending: '送信中...',
      defaultCheckItems: [
        { id: 'google', label: 'Google検索' },
        { id: 'social', label: 'ソーシャルメディア' },
        { id: 'friend', label: '友人のおすすめ' },
        { id: 'blog', label: 'ブログ・記事' },
        { id: 'other', label: 'その他' }
      ]
    }
  };

  // Determine which language to use
  const getLanguage = () => {
    if (language !== 'auto') return language;
    
    // Auto-detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('ja')) return 'ja';
    return 'en';
  };

  // Get merged translations
  const lang = getLanguage();
  const t = { ...defaultTranslations[lang], ...translations };

  // Resolve title - use prop or default translation
  const resolvedTitle = title || t.title;
  const resolvedDescription = description || t.description;
  const resolvedButtonText = buttonText || t.buttonText;
  const resolvedPlaceholder = t.placeholder;
  const resolvedCheckItems = checkItems.length > 0 ? checkItems : t.defaultCheckItems;

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
      if (item.id === 'other') {
        setOtherSource('');
      }
    }
  };

  // Send data to API endpoint
  const sendToApi = async (data) => {
    if (!apiEndpoint) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        websiteId: id,
        sources: data,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        language: lang
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

      await fetch(apiEndpoint, options);
      console.log('SignUpSource: Data sent to API successfully');
    } catch (error) {
      console.error('SignUpSource: Failed to send data to API:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Store data in localStorage
  const storeLocally = (data) => {
    if (!storeLocal) return;

    try {
      const existingData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
      const newEntry = {
        websiteId: id,
        sources: data,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        language: lang
      };
      existingData.push(newEntry);
      localStorage.setItem(localStorageKey, JSON.stringify(existingData));
      console.log('SignUpSource: Data stored locally');
    } catch (error) {
      console.error('SignUpSource: Failed to store data locally:', error);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    let itemsToSend = [...selectedItems];
    
    if (selectedItems.some(item => item.id === 'other') && otherSource.trim() !== '') {
      itemsToSend = itemsToSend.map(item => {
        if (item.id === 'other') {
          return { ...item, customLabel: otherSource.trim(), label: `Other: ${otherSource.trim()}` };
        }
        return item;
      });
    }

    const submissionData = {
      websiteId: id,
      sources: itemsToSend,
      timestamp: new Date().toISOString(),
      language: lang
    };
    
    if (callback && typeof callback === 'function') {
      callback(submissionData);
    }
    
    if (apiEndpoint) {
      sendToApi(itemsToSend);
    }
    
    if (storeLocal) {
      storeLocally(itemsToSend);
    }

    if (!callback && !apiEndpoint && !storeLocal) {
      console.log('SignUpSource:', submissionData);
    }
    
    onClose();
  };

  const isOtherSelected = selectedItems.some(item => item.id === 'other');
  const isSubmitDisabled = isOtherSelected && otherSource.trim() === '';

  if (!isOpen) return null;

  return (
    <div className="signupsource-modal" onClick={handleBackdropClick}>
      <div className="signupsource-modal-content">
        <h2 className="signupsource-title">{resolvedTitle}</h2>
        <p className="signupsource-description">{resolvedDescription}</p>
        
        <div className="signupsource-check-items">
          {resolvedCheckItems.map((item) => (
            <div key={item.id} className="signupsource-check-item">
              <input
                type="checkbox"
                id={`signupsource-${item.id}`}
                checked={selectedItems.some(i => i.id === item.id)}
                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              />
              <label htmlFor={`signupsource-${item.id}`}>{item.label}</label>
              
              {item.id === 'other' && selectedItems.some(i => i.id === 'other') && (
                <input
                  type="text"
                  ref={otherInputRef}
                  className="signupsource-other-input"
                  placeholder={resolvedPlaceholder}
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
          disabled={isSubmitDisabled || isSubmitting}
        >
          {isSubmitting ? t.sending : resolvedButtonText}
        </button>
      </div>
    </div>
  );
};

export default SignUpSource;
