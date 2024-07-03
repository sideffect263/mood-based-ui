import React, { useState } from 'react';
import SleepyLayout from './components/SleepyLayout';
import RelaxedLayout from './components/RelaxedLayout';
import AnxiousLayout from './components/AnxiousLayout';
import TransitionWrapper from './components/TransitionWrapper';
import './App.css';

function App() {
  const [mood, setMood] = useState('relaxed');

  const renderLayout = () => {
    switch (mood) {
      case 'sleepy':
        return <SleepyLayout />;
      case 'relaxed':
        return <RelaxedLayout />;
      case 'anxious':
        return <AnxiousLayout />;
      default:
        return <RelaxedLayout />;
    }
  };

  return (
    <div className="App">
      <nav className="mood-nav">
        <button onClick={() => setMood('sleepy')}>Sleepy</button>
        <button onClick={() => setMood('relaxed')}>Relaxed</button>
        <button onClick={() => setMood('anxious')}>Anxious</button>
      </nav>
      <TransitionWrapper locationKey={mood}>
        {renderLayout()}
      </TransitionWrapper>
    </div>
  );
}

export default App;