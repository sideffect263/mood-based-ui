// TransitionWrapper.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/TransitionWrapper.css';

const TransitionWrapper = ({ children, locationKey }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={locationKey}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.1,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default TransitionWrapper;