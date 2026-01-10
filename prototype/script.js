// Demo implementation of the SignUpSource modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('signupsource-modal');
    const triggerBtn = document.getElementById('trigger-btn');
    const modalButton = document.getElementById('modal-button');
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
    
    // Mock configuration for SignUpSource
    const signupSourceConfig = {
        id: 'demo-website-123',
        title: 'Where did you hear about us?',
        description: 'Please let us know how you found our website.',
        buttonText: 'Submit',
        checkItems: [
            { id: 'item1', label: 'Google Search', value: 'google' },
            { id: 'item2', label: 'Friend Recommendation', value: 'friend' },
            { id: 'item3', label: 'Social Media', value: 'social' },
            { id: 'item4', label: 'Blog or Article', value: 'blog' },
            { id: 'item5', label: 'Other', value: 'other' }
        ],
        callback: function(userCheckedItems) {
            console.log('User selected sources:', userCheckedItems);
            // In a real implementation, this data would be sent to the server
            alert('Thank you for your feedback!\n\nSelected sources: ' + 
                userCheckedItems.map(item => item.label).join(', '));
        }
    };

    // Function that mimics the signupsource script from CDN
    window.signupsource = function(options) {
        console.log('SignUpSource initialized with options:', options);
        
        // Update modal content based on options
        document.getElementById('modal-title').textContent = options.title || 'Where did you hear about us?';
        document.getElementById('modal-description').textContent = options.description || 'Please let us know how you found our website.';
        document.getElementById('modal-button').textContent = options.buttonText || 'Submit';
        
        // Show the modal
        modal.classList.add('active');
    };
    
    // Simulate new user clicking the trigger button
    triggerBtn.addEventListener('click', () => {
        // Call the signupsource function as described in the README
        window.signupsource(signupSourceConfig);
    });
    
    // Handle submit button click
    modalButton.addEventListener('click', () => {
        const userCheckedItems = [];
        
        // Collect checked items
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                userCheckedItems.push({
                    id: checkbox.id,
                    value: checkbox.value,
                    label: checkbox.nextElementSibling.textContent
                });
            }
        });
        
        // Call the callback function if provided
        if (signupSourceConfig.callback && typeof signupSourceConfig.callback === 'function') {
            signupSourceConfig.callback(userCheckedItems);
        } else {
            console.log('Default callback: Send data to SignUpSource server');
            console.log('User checked items:', userCheckedItems);
        }
        
        // Hide the modal
        modal.classList.remove('active');
        
        // Reset checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // For demo purposes, simulate a new user after 1 second
    setTimeout(() => {
        console.log('Demo: Simulating new user visit...');
    }, 1000);
}); 