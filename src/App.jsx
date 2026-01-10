import React, { useState } from 'react';
import './index.css';
import SignUpSource from './components/SignUpSource';
import useSignUpSource from './hooks/useSignUpSource';

const App = () => {
  // Demo configuration
  const [demoConfig, setDemoConfig] = useState({
    id: 'demo-website-123',
    title: 'Where did you hear about us?',
    description: 'Please let us know how you found our website.',
    buttonText: 'Submit',
    checkItems: [
      { id: 'douyin', label: '抖音' },
      { id: 'xiaohongshu', label: '小红书' },
      { id: 'twitter', label: 'Twitter' },
      { id: 'wechatarticle', label: '微信公众号' },
      { id: 'coze', label: '扣子' },
      { id: 'other', label: '其他' }
    ]
  });

  // Use the hook for the demo
  const { isOpen, openModal, closeModal, resetUser, modalProps } = useSignUpSource({
    ...demoConfig,
    callback: (selectedItems) => {
      console.log('Selected items:', selectedItems);
      alert('Thank you for your feedback!\n\nSelected sources: ' + 
        selectedItems.map(item => item.label).join(', '));
    },
    showOnlyOnce: true
  });

  return (
    <div className="container">
      <header className="header">
        <h1>SignUpSource - Understand Your Users</h1>
        <p className="tagline">Discover how users find your website with a simple, elegant modal</p>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h2>Track Your Growth Channels</h2>
            <p>SignUpSource is a lightweight, easy-to-integrate component that helps you collect valuable data about where your users come from.</p>
            <div className="cta-buttons">
              <button onClick={openModal} className="primary-button">Try Demo</button>
              <button onClick={resetUser} className="secondary-button">Reset Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="demo-frame">
              <div className="demo-modal">
                <h3>{demoConfig.title}</h3>
                <p>{demoConfig.description}</p>
                <div className="demo-items">
                  {demoConfig.checkItems.map(item => (
                    <div key={item.id} className="demo-item">
                      <span className="demo-checkbox"></span>
                      <span>{item.label}</span>
                      {item.id === 'other' && (
                        <div className="demo-other-input">
                          <span className="demo-input-placeholder">Please specify...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="demo-button">{demoConfig.buttonText}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Why Use SignUpSource?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Easy Integration</h3>
              <p>Just add a single script tag to your website and configure it with a few lines of code.</p>
            </div>
            <div className="feature-card">
              <h3>Customizable</h3>
              <p>Change the title, description, button text, and check items to match your brand.</p>
            </div>
            <div className="feature-card">
              <h3>Lightweight</h3>
              <p>Minimal impact on your site's performance with a tiny footprint.</p>
            </div>
            <div className="feature-card">
              <h3>User Friendly</h3>
              <p>Simple, clean interface that doesn't disrupt the user experience.</p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Include the Script</h3>
              <pre><code>{`<script src="https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/signupsource.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/style.css">`}</code></pre>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Configure It</h3>
              <pre><code>{`signupsource({
  id: 'your-website-id',
  title: 'How did you find us?',
  description: 'We would love to know!',
  buttonText: 'Submit',
  checkItems: [
    { id: 'douyin', label: '抖音' },
    { id: 'wechat', label: '微信' },
    { id: 'kuaishou', label: '快手' },
    { id: 'baidu', label: '百度' },
    { id: 'toutiao', label: '头条' },
    { id: 'other', label: '其他' },
  ],
  callback: function(items) {
    console.log(items);
  }
});`}</code></pre>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Collect Data</h3>
              <p>New users will see the modal, and their selections will be available in your callback function.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <p>Add SignUpSource to your website today and start gaining valuable insights.</p>
          <button onClick={openModal} className="primary-button">Try Demo</button>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 <a href="https://openg.space" style={{ color: 'inherit', textDecoration: 'none' }}>OpengSpace</a> | <a href="https://productseed.openg.space" style={{ color: 'inherit', textDecoration: 'none' }}>ProductSeed</a></p>
      </footer>

      {/* SignUpSource component */}
      <SignUpSource {...modalProps} />
    </div>
  );
};

export default App;
