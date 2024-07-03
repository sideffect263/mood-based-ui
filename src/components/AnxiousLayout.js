// AnxiousLayout.js
import React from 'react';
import { motion } from 'framer-motion';
import CommonLayout from './CommonLayout';
import { artworks, categories } from './GalleryData';
import './styles/AnxiousLayout.css';

function AnxiousLayout() {
  return (
    <CommonLayout
      backgroundColor="#f0f7ff"
      headerColor="#e6f2ff"
      contentColor="#ffffff"
    >
      {{
        header: (
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Soothing Art Gallery
          </motion.h1>
        ),
        main: (
          <>
            <motion.section 
              className="categories"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {categories.map((category, index) => (
                <motion.button 
                  key={category}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.section>
            <motion.div 
              className="artwork-grid"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {artworks.map((artwork) => (
                <motion.div 
                  key={artwork.id}
                  className="artwork-item"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + artwork.id * 0.1, duration: 0.5 }}
                >
                  <h3>{artwork.title}</h3>
                  <p>{artwork.artist}</p>
                  <p>{artwork.category}</p>
                </motion.div>
              ))}
            </motion.div>
          </>
        ),
        footer: (
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Let the calming beauty of art ease your mind.
          </motion.p>
        ),
      }}
    </CommonLayout>
  );
}

export default AnxiousLayout;