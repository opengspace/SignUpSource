# SignUpSource

SignUpSource is a lightweight, customizable component that helps websites collect information about where their users come from. This valuable data can help you understand your most effective growth channels.

## Features

- 🚀 **Easy Integration** - Add with a single script tag or use as a React component
- 🎨 **Customizable** - Change the title, description, button text, and check items
- 🔍 **Track User Sources** - Collect data on how users discover your website
- 📊 **Insights** - Understand which channels drive the most traffic
- 🪶 **Lightweight** - Minimal impact on page load performance
- 🧩 **React Support** - Native React component with hooks
- 📝 **Custom Input** - Allow users to specify their own source when selecting "Other"

## Live Demo

Try SignUpSource in action: **[View Live Demo](https://opengspace.github.io/SignUpSource/)** *(Coming soon after GitHub Pages deployment)*

The demo showcases all the features and allows you to interact with the component directly in your browser.

## Installation

### Via NPM (for React projects)

```bash
npm install @opengspace/signupsource
# or
yarn add @opengspace/signupsource
# or
pnpm add @opengspace/signupsource
```

### Via CDN (for any website)

```html
<script src="https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/signupsource.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/style.css">
```

## Usage

### As a React Component

```jsx
import React from 'react';
import { SignUpSource, useSignUpSource } from '@opengspace/signupsource';
import '@opengspace/signupsource/dist/style.css';

function App() {
  const { modalProps } = useSignUpSource({
    id: 'your-website-id',
    title: 'Where did you hear about us?',
    description: 'We\'d love to know how you found our website.',
    buttonText: 'Submit',
    checkItems: [
      { id: 'google', label: 'Google Search' },
      { id: 'social', label: 'Social Media' },
      { id: 'friend', label: 'Friend Recommendation' },
      { id: 'blog', label: 'Blog or Article' },
      { id: 'other', label: 'Other' }
    ],
    callback: (selectedItems) => {
      console.log('User selected sources:', selectedItems);
      // Note: The "Other" option will include customLabel property with user input
      // Example: { id: 'other', label: 'Other: YouTube', customLabel: 'YouTube' }
    }
  });

  return (
    <div>
      <h1>Your Website</h1>
      {/* Your website content */}
      
      {/* SignUpSource modal */}
      <SignUpSource {...modalProps} />
    </div>
  );
}
```

### Via Script Tag

```html
<script>
  // Check if the user is new
  const isNewUser = !localStorage.getItem('returning_user');
  
  if (isNewUser) {
    // Show SignUpSource modal for new users
    signupsource({
      id: 'your-website-id',
      title: 'Where did you hear about us?',
      description: 'We\'d love to know how you found our website.',
      buttonText: 'Submit',
      checkItems: [
        { id: 'google', label: 'Google Search' },
        { id: 'social', label: 'Social Media' },
        { id: 'friend', label: 'Friend Recommendation' },
        { id: 'blog', label: 'Blog or Article' },
        { id: 'other', label: 'Other' }
      ],
      callback: function(selectedItems) {
        console.log('User selected sources:', selectedItems);
        // If user selected "Other" and provided custom text:
        // The item will have a customLabel property with their input
        localStorage.setItem('returning_user', 'true');
      }
    });
  }
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | string | '' | Your website ID for tracking purposes |
| `title` | string | 'Where did you hear about us?' | The title of the modal |
| `description` | string | 'Please let us know how you found our website.' | The description text |
| `buttonText` | string | 'Submit' | The text for the submit button |
| `checkItems` | array | See below | Array of items users can select |
| `callback` | function | null | Function called when user submits their selection |
| `showOnlyOnce` | boolean | true | Whether to show the modal only once per user (React only) |

Default `checkItems`:

```js
[
  { id: 'google', label: 'Google Search' },
  { id: 'social', label: 'Social Media' },
  { id: 'friend', label: 'Friend Recommendation' },
  { id: 'blog', label: 'Blog or Article' },
  { id: 'other', label: 'Other' }
]
```

### The "Other" Option

When a user selects the "Other" option:
- A text input field appears below the option
- Users must enter text before submitting the form
- The callback receives the "other" item with a `customLabel` property containing the user's input
- The `label` property for "other" is changed to `"Other: [user input]"`

Example response when user selects "Other" and types "Newsletter":

```js
[
  {
    id: "other",
    label: "Other: Newsletter",
    customLabel: "Newsletter"
  }
]
```

## React Hook API

The `useSignUpSource` hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | boolean | Whether the modal is currently open |
| `openModal` | function | Function to manually open the modal |
| `closeModal` | function | Function to manually close the modal |
| `resetUser` | function | Function to reset the user's status (for testing) |
| `modalProps` | object | Props to pass to the SignUpSource component |

## Links

- **Live Demo**: [https://opengspace.github.io/SignUpSource](https://opengspace.github.io/SignUpSource)
- **GitHub Repository**: [https://github.com/opengspace/SignUpSource](https://github.com/opengspace/SignUpSource)
- **NPM Package**: [https://www.npmjs.com/package/@opengspace/signupsource](https://www.npmjs.com/package/@opengspace/signupsource)

## License

MIT © OpengTech Team
