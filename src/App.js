import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artworks, categories } from './components/GalleryData';
import './App.css';

// Define a common transition for most animations
const slowTransition = { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] };

function App() {
  const [mood, setMood] = useState('relaxed');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const moodStyles = {
    relaxed: {
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      headerColor: '#2c3e50',
      textColor: '#34495e',
      accentColor: '#3498db',
    },
    energized: {
      background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
      headerColor: '#ffffff',
      textColor: '#2c3e50',
      accentColor: '#e74c3c',
    },
    calm: {
      background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      headerColor: '#2c3e50',
      textColor: '#34495e',
      accentColor: '#27ae60',
    },
  };

  const currentStyle = moodStyles[mood];

  const filteredArtworks = selectedCategory === 'All' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

  return (
    <motion.div 
      className="app" 
      animate={{ background: currentStyle.background }}
      transition={{ ...slowTransition, duration: 2 }} // Even slower for background
    >
      <motion.nav className="mood-nav" layout transition={slowTransition}>
        {Object.keys(moodStyles).map((moodOption) => (
          <motion.button
            key={moodOption}
            layout
            onClick={() => setMood(moodOption)}
            animate={{
              backgroundColor: mood === moodOption ? currentStyle.accentColor : 'rgba(255,255,255,0.2)',
              color: mood === moodOption ? '#ffffff' : currentStyle.textColor,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={slowTransition}
          >
            {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
          </motion.button>
        ))}
      </motion.nav>

      <motion.header layout transition={slowTransition}>
        <motion.h1
          layout
          animate={{ 
            color: currentStyle.headerColor,
            fontSize: mood === 'energized' ? '3em' : '2.5em',
          }}
          transition={slowTransition}
        >
          Mood-Adaptive Art Gallery
        </motion.h1>
      </motion.header>

      <motion.section 
        className="categories"
        layout
        animate={{ 
          justifyContent: mood === 'calm' ? 'center' : 'flex-start',
          flexWrap: mood === 'energized' ? 'nowrap' : 'wrap',
        }}
        transition={slowTransition}
      >
        {categories.map(category => (
          <motion.button 
            key={category}
            layout
            onClick={() => setSelectedCategory(category)}
            animate={{
              backgroundColor: selectedCategory === category ? currentStyle.accentColor : 'rgba(255,255,255,0.2)',
              color: selectedCategory === category ? '#ffffff' : currentStyle.textColor,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={slowTransition}
          >
            {category}
          </motion.button>
        ))}
      </motion.section>

      <motion.div 
        className="artwork-grid"
        layout
        animate={{ 
          gridTemplateColumns: mood === 'energized' ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
        }}
        transition={slowTransition}
      >
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map(artwork => (
            <motion.div 
              key={artwork.id} 
              className="artwork-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: currentStyle.textColor,
                borderColor: currentStyle.accentColor,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={slowTransition}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 8px rgba(0,0,0,0.15)' }}
            >
              <motion.h3 layout transition={slowTransition}>{artwork.title}</motion.h3>
              <motion.p layout transition={slowTransition}>{artwork.artist}</motion.p>
              <motion.p 
                className="category-tag" 
                layout
                style={{ backgroundColor: currentStyle.accentColor }}
                transition={slowTransition}
              >
                {artwork.category}
              </motion.p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.footer
        layout
        animate={{
          opacity: mood === 'calm' ? 1 : 0.7,
          color: currentStyle.textColor,
        }}
        transition={slowTransition}
      >
        <p>Experience art through your current mood.</p>
      </motion.footer>
    </motion.div>
  );
}

export default App;