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
      apiEndpoint = '',
      apiMethod = 'POST',
      apiHeaders = {},
      storeLocal = false,
      localStorageKey = 'signupsource_data'
    } = options || {};

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
    titleEl.textContent = title;
    
    // Create description
    const descEl = document.createElement('p');
    descEl.className = 'signupsource-description';
    descEl.style.cssText = 'margin-bottom:25px; color:#555;';
    descEl.textContent = description;
    
    // Create check items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'signupsource-check-items';
    itemsContainer.style.cssText = 'margin-bottom:25px;';
    
    // Create submit button
    const button = document.createElement('button');
    button.className = 'signupsource-button';
    button.style.cssText = 'width:100%; padding:12px; font-size:16px; font-weight:bold; background-color:#4a69bd; color:white; border:none; border-radius:5px; cursor:pointer; transition:background-color 0.3s;';
    button.textContent = buttonText;
    button.disabled = true;
    
    // Store other input for later reference
    let otherInput = null;
    
    // Add check items
    checkItems.forEach(item => {
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
        input.placeholder = 'Please specify';
        input.style.cssText = 'flex:1; width:100%; margin-top:8px; margin-left:28px; padding:8px 10px; border:1px solid #ddd; border-radius:4px; font-size:14px; transition:border-color 0.3s;';
        
        // Show/hide other input based on checkbox state
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            otherInputContainer.style.display = 'block';
            input.focus();
            // Disable button if other is checked but no text
            button.disabled = input.value.trim() === '';
          } else {
            otherInputContainer.style.display = 'none';
            button.disabled = false;
          }
        });
        
        // Enable/disable button based on input
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
      button.textContent = 'Sending...';
      
      try {
        const payload = {
          websiteId: id,
          sources: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
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
      } catch (error) {
        console.error('SignUpSource: Failed to send data to API:', error);
      } finally {
        button.textContent = buttonText;
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
          url: window.location.href
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
      
      // Collect checked items
      checkItems.forEach(item => {
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
        timestamp: new Date().toISOString()
      };
      
      // Call callback if provided
      if (callback && typeof callback === 'function') {
        callback(submissionData);
      }
      
      // Send to API if configured
      if (apiEndpoint) {
        sendToApi(selectedItems);
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
      
      // Remove modal
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
