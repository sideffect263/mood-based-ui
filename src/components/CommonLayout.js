// CommonLayout.js
import React from 'react';
import { motion } from 'framer-motion';
import './styles/CommonLayout.css';

const CommonLayout = ({ children, backgroundColor, headerColor, contentColor }) => {
  return (
    <motion.div 
      className="common-layout"
      animate={{ backgroundColor }}
      transition={{ duration: 0.5 }}
    >
      <motion.header
        animate={{ backgroundColor: headerColor }}
        transition={{ duration: 0.5 }}
      >
        {children.header}
      </motion.header>
      <motion.main
        animate={{ backgroundColor: contentColor }}
        transition={{ duration: 0.5 }}
      >
        {children.main}
      </motion.main>
      <motion.footer
        animate={{ backgroundColor: headerColor }}
        transition={{ duration: 0.5 }}
      >
        {children.footer}
      </motion.footer>
    </motion.div>
  );
};

export default CommonLayout;