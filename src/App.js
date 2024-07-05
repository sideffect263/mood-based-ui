import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { artworks, categories } from './components/GalleryData';
import { moodStyles } from './styles/moodStyles';
import './App.css';

const MotionArtworkItem = React.memo(React.forwardRef(({ artwork, currentStyle, custom }, ref) => {
  return (
    <motion.div
      className="artwork-item"
      ref={ref}
      custom={custom}
      style={{ ...currentStyle.artworkItem }}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 2, delay: custom * 0.2 }}
    >
      <motion.img 
        src={artwork.image} 
        alt={artwork.title}
        initial={{ filter: 'grayscale(100%)' }}
        animate={{ filter: 'grayscale(0%)' }}
        transition={{ duration: 2 }}
      />
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {artwork.title}
      </motion.h3>
    </motion.div>
  );
}));

const MoodNav = ({ mood, setMood, currentStyle }) => (
  <motion.nav 
    className="mood-nav"
    style={currentStyle.nav}
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {Object.keys(moodStyles).map((moodOption) => (
      <motion.button
        key={moodOption}
        onClick={() => setMood(moodOption)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Set mood to ${moodOption}`}
        style={{ 
          backgroundColor: mood === moodOption ? currentStyle.accentColor : 'transparent',
          color: currentStyle.nav.color,
          boxShadow: currentStyle.boxShadow,
        }}
      >
        {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
      </motion.button>
    ))}
  </motion.nav>
);

const Header = ({ mood, currentStyle }) => (
  <motion.header 
    style={currentStyle.header}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    <motion.h1
      style={{ textShadow: currentStyle.textShadow }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
    >
      Current Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </motion.h1>
  </motion.header>
);

const Categories = ({ categories, selectedCategory, setSelectedCategory, currentStyle }) => (
  <motion.div 
    className="categories" 
    style={currentStyle.categories}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 1.5 }}
  >
    {categories.map((category) => (
      <motion.button
        key={category}
        className={selectedCategory === category ? 'selected' : ''}
        onClick={() => setSelectedCategory(category)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Filter by ${category}`}
        style={{ 
          backgroundColor: selectedCategory === category ? currentStyle.accentColor : 'transparent',
          color: currentStyle.categories.color,
          boxShadow: currentStyle.boxShadow,
        }}
      >
        {category}
      </motion.button>
    ))}
  </motion.div>
);

const Footer = ({ mood, currentStyle }) => (
  <motion.footer 
    style={currentStyle.footer}
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, delay: 2 }}
  >
    <p>Powered by your current mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
  </motion.footer>
);

const MouseTrail = () => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    console.log('MouseTrail mounted');
    console.log('');
    const handleMouseMove = (e) => {
      setTrail((prevTrail) => [...prevTrail, { x: e.clientX, y: e.clientY }].slice(-20));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="trail-dot"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

function App() {
  const [mood, setMood] = useState('relaxed');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);

  
  useEffect(() => {
    let mouseData = { x: 0, y: 0, speed: 0 };
    let lastTime = Date.now();
    let lastPosition = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      const distance = Math.sqrt(Math.pow(e.clientX - lastPosition.x, 2) + Math.pow(e.clientY - lastPosition.y, 2));
      const speed = distance / timeDiff;

      mouseData = {
        x: e.clientX,
        y: e.clientY,
        speed: speed
      };

      lastTime = currentTime;
      lastPosition = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const fetchMood = async () => {
      console.log('Fetching mood...');
      setIsLoading(true);
      setError(null);
      try {
        console.log('Sending mouse data:', mouseData);
        const response = await axios.post('https://me-predict-server.onrender.com/predict', mouseData);
        console.log('Predicted mood:');
        console.log(response.data.condition);
        setMood(response.data.condition);
      } catch (error) {
        console.error('Error fetching mood:', error);
        setError('Failed to predict mood. Using default mood.');
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchMood, 10000/1.5); // Fetch every second

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentStyle = moodStyles[mood];

  useEffect(() => {
    setFilteredArtworks(
      selectedCategory === 'All'
        ? artworks
        : artworks.filter(artwork => artwork.category === selectedCategory)
    );
  }, [selectedCategory]);

  const shuffleArtworks = () => {
    setFilteredArtworks(prevArtworks => [...prevArtworks].sort(() => Math.random() - 0.5));
  };

  return (
    <motion.div 
      className="app" 
      animate={{ background: currentStyle.background }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <MouseTrail />
      <MoodNav mood={mood} setMood={setMood} currentStyle={currentStyle} />
      <Header mood={mood} currentStyle={currentStyle} />
      {isLoading && (
        <motion.div 
          className="loading-indicator"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          Predicting mood...
        </motion.div>
      )}
      {error && <motion.p style={{position:'absolute', opacity:0.3}} initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>{error}</motion.p>}
      <Categories 
        categories={categories} 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentStyle={currentStyle}
      />
      <motion.button
        className="shuffle-button"
        onClick={shuffleArtworks}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: currentStyle.accentColor,
          color: currentStyle.nav.color,
          boxShadow: currentStyle.boxShadow,
        }}
      >
        Shuffle Artworks
      </motion.button>
      <motion.div 
        className="artwork-grid"
        layout
        animate={{ 
          gridTemplateColumns: mood === 'anxious' ? 'repeat(2, 1fr)' : mood === 'engaged' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gridGap: mood === 'relaxed' ? '40px' : '30px',
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {filteredArtworks.map((artwork, index) => (
            <MotionArtworkItem 
              key={artwork.id} 
              artwork={artwork}
              currentStyle={currentStyle}
              custom={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <Footer mood={mood} currentStyle={currentStyle} />
    </motion.div>
  );
}

export default App;