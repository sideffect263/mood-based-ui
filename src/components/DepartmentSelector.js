import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchDepartments } from '../services/metMuseumApi';

// Departments known to typically have more images in the public domain
const RECOMMENDED_DEPARTMENTS = [11, 14, 21, 6, 10, 9];

const DepartmentSelector = ({ onDepartmentChange, currentStyle }) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoading(true);
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load departments:', error);
        setError('Failed to load departments');
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const toggleDepartment = (departmentId) => {
    setSelectedDepartments(prev => {
      if (prev.includes(departmentId)) {
        const newSelection = prev.filter(id => id !== departmentId);
        onDepartmentChange(newSelection.length > 0 ? newSelection.join('|') : null);
        return newSelection;
      } else {
        const newSelection = [...prev, departmentId];
        onDepartmentChange(newSelection.join('|'));
        return newSelection;
      }
    });
  };

  const clearSelection = () => {
    setSelectedDepartments([]);
    onDepartmentChange(null);
  };

  const selectRecommended = () => {
    setSelectedDepartments(RECOMMENDED_DEPARTMENTS);
    onDepartmentChange(RECOMMENDED_DEPARTMENTS.join('|'));
  };

  if (isLoading) {
    return <div>Loading departments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="department-selector-container">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <motion.button
          className="department-selector-toggle"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: currentStyle.accentColor,
            color: currentStyle.nav.color,
            boxShadow: currentStyle.boxShadow,
            padding: '8px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '10px 0'
          }}
        >
          {isOpen ? 'Hide Departments' : 'Filter by Department'}
        </motion.button>
        
        <motion.button
          onClick={selectRecommended}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            color: 'white',
            boxShadow: currentStyle.boxShadow,
            padding: '8px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '10px 0'
          }}
        >
          Use Recommended Departments
        </motion.button>
        
        {selectedDepartments.length > 0 && (
          <motion.button
            onClick={clearSelection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: 'rgba(255, 100, 100, 0.7)',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '10px 0'
            }}
          >
            Clear Selection
          </motion.button>
        )}
      </div>

      <motion.div
        className="department-selector"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          overflow: 'hidden',
          marginBottom: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: isOpen ? '15px' : '0px',
          borderRadius: '8px'
        }}
      >
        <div className="department-hint" style={{ marginBottom: '15px', textAlign: 'center', color: currentStyle.nav.color }}>
          <p>Tip: Departments like Paintings, Photographs, and European Paintings typically have more images.</p>
        </div>
        
        <div className="department-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {departments.map((department) => (
            <motion.button
              key={department.departmentId}
              onClick={() => toggleDepartment(department.departmentId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: selectedDepartments.includes(department.departmentId) 
                  ? currentStyle.accentColor 
                  : RECOMMENDED_DEPARTMENTS.includes(department.departmentId)
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(255, 255, 255, 0.2)',
                color: currentStyle.nav.color,
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {department.displayName}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentSelector; 