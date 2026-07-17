import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '40px', color: '#e9edf2', background: '#0c1420', minHeight: '100vh' }}>
      <h1 style={{ color: '#c9a84c' }}>✅ Test Page Works!</h1>
      <p>If you can see this, routing is working correctly.</p>
      <p>Try going to: /system, /dashboard, /settings</p>
    </div>
  );
};

export default TestPage;