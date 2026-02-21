import SignUpSource from './components/SignUpSource';
import useSignUpSource from './hooks/useSignUpSource';

// Export the component and the hook
export { SignUpSource, useSignUpSource };

// For standalone use (via script tag)
if (typeof window !== 'undefined') {
  window.signupsource = (options) => {
    // Default options
    const {
      id = '',
      title = '',
      description = '',
      buttonText = '',
      checkItems = [],
      callback,
      apiEndpoint = '',
      apiMethod = 'POST',
      apiHeaders = {},
      storeLocal = false,
      localStorageKey = 'signupsource_data',
      language = 'auto',
      translations = {}
    } = options || {};

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
        description: 'どのように우리 사이트를 찾으셨는지 알려주세요.',
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

    // Determine language
    const getLanguage = () => {
      if (language !== 'auto') return language;
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('zh')) return 'zh';
      if (browserLang.startsWith('ja')) return 'ja';
      return 'en';
    };

    const lang = getLanguage();
    const t = { ...defaultTranslations[lang], ...translations };

    // Resolve values
    const resolvedTitle = title || t.title;
    const resolvedDescription = description || t.description;
    const resolvedButtonText = buttonText || t.buttonText;
    const resolvedPlaceholder = t.placeholder;
    const resolvedSending = t.sending;
    const resolvedCheckItems = checkItems.length > 0 ? checkItems : t.defaultCheckItems;

    // Create modal container if it doesn't exist
    let container = document.getElementById('signupsource-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'signupsource-container';
      document.body.appendChild(container);
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'signupsource-modal';
    modal.style.cssText = 'position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; animation:signupsource-fadeIn 0.3s;';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'signupsource-modal-content';
    modalContent.style.cssText = 'background-color:white; padding:30px; border-radius:8px; box-shadow:0 5px 20px rgba(0,0,0,0.2); max-width:500px; width:90%; position:relative; animation:signupsource-slideDown 0.4s;';
    
    // Create title
    const titleEl = document.createElement('h2');
    titleEl.className = 'signupsource-title';
    titleEl.style.cssText = 'font-size:24px; margin-bottom:15px; color:#2a2a72;';
    titleEl.textContent = resolvedTitle;
    
    // Create description
    const descEl = document.createElement('p');
    descEl.className = 'signupsource-description';
    descEl.style.cssText = 'margin-bottom:25px; color:#555;';
    descEl.textContent = resolvedDescription;
    
    // Create check items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'signupsource-check-items';
    itemsContainer.style.cssText = 'margin-bottom:25px;';
    
    // Create submit button
    const button = document.createElement('button');
    button.className = 'signupsource-button';
    button.style.cssText = 'width:100%; padding:12px; font-size:16px; font-weight:bold; background-color:#4a69bd; color:white; border:none; border-radius:5px; cursor:pointer; transition:background-color 0.3s;';
    button.textContent = resolvedButtonText;
    button.disabled = true;
    
    // Store other input for later reference
    let otherInput = null;
    
    // Add check items
    resolvedCheckItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'signupsource-check-item';
      itemDiv.style.cssText = 'display:flex; align-items:center; margin-bottom:12px; padding:8px 10px; border-radius:4px; transition:background-color 0.2s; flex-wrap:wrap;';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `signupsource-${item.id}`;
      checkbox.style.cssText = 'margin-right:10px; width:18px; height:18px;';
      
      const label = document.createElement('label');
      label.htmlFor = `signupsource-${item.id}`;
      label.style.cssText = 'font-size:16px; cursor:pointer;';
      label.textContent = item.label;
      
      // Create a container for other input if this is the "other" option
      const otherInputContainer = document.createElement('div');
      otherInputContainer.style.cssText = 'width:100%; display:none;';
      
      if (item.id === 'other') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'signupsource-other-input';
        input.placeholder = resolvedPlaceholder;
        input.style.cssText = 'flex:1; width:100%; margin-top:8px; margin-left:28px; padding:8px 10px; border:1px solid #ddd; border-radius:4px; font-size:14px; transition:border-color 0.3s;';
        
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            otherInputContainer.style.display = 'block';
            input.focus();
            button.disabled = input.value.trim() === '';
          } else {
            otherInputContainer.style.display = 'none';
            button.disabled = false;
          }
        });
        
        input.addEventListener('input', function() {
          button.disabled = checkbox.checked && this.value.trim() === '';
        });
        
        otherInputContainer.appendChild(input);
        otherInput = input;
      }
      
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      itemDiv.appendChild(otherInputContainer);
      itemsContainer.appendChild(itemDiv);
    });

    // Function to send data to API
    const sendToApi = async (data) => {
      if (!apiEndpoint) return;

      button.disabled = true;
      button.textContent = resolvedSending;
      
      try {
        const payload = {
          websiteId: id,
          sources: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          language: lang
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

        await fetch(apiEndpoint, fetchOptions);
        console.log('SignUpSource: Data sent to API successfully');
      } catch (error) {
        console.error('SignUpSource: Failed to send data to API:', error);
      } finally {
        button.textContent = resolvedButtonText;
        button.disabled = false;
      }
    };

    // Function to store data locally
    const storeLocally = (data) => {
      if (!storeLocal) return;

      try {
        const existingData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        const newEntry = {
          websiteId: id,
          sources: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          language: lang
        };
        existingData.push(newEntry);
        localStorage.setItem(localStorageKey, JSON.stringify(existingData));
        console.log('SignUpSource: Data stored locally');
      } catch (error) {
        console.error('SignUpSource: Failed to store data locally:', error);
      }
    };
    
    // Add event listener to button
    button.addEventListener('click', () => {
      const selectedItems = [];
      
      resolvedCheckItems.forEach(item => {
        const checkbox = document.getElementById(`signupsource-${item.id}`);
        if (checkbox && checkbox.checked) {
          if (item.id === 'other') {
            const otherValue = otherInput ? otherInput.value.trim() : '';
            if (otherValue) {
              selectedItems.push({
                id: item.id,
                label: `Other: ${otherValue}`,
                customLabel: otherValue
              });
            }
          } else {
            selectedItems.push({
              id: item.id,
              label: item.label
            });
          }
        }
      });

      const submissionData = {
        websiteId: id,
        sources: selectedItems,
        timestamp: new Date().toISOString(),
        language: lang
      };
      
      if (callback && typeof callback === 'function') {
        callback(submissionData);
      }
      
      if (apiEndpoint) {
        sendToApi(selectedItems);
      }
      
      if (storeLocal) {
        storeLocally(selectedItems);
      }

      if (!callback && !apiEndpoint && !storeLocal) {
        console.log('SignUpSource:', submissionData);
      }
      
      container.removeChild(modal);
    });
    
    // Add close functionality when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        container.removeChild(modal);
      }
    });
    
    // Assemble modal
    modalContent.appendChild(titleEl);
    modalContent.appendChild(descEl);
    modalContent.appendChild(itemsContainer);
    modalContent.appendChild(button);
    modal.appendChild(modalContent);
    container.appendChild(modal);
    
    // Add styles for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes signupsource-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes signupsource-slideDown {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  };
} 
