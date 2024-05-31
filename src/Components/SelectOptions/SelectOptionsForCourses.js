import React, { useState, useEffect, useRef } from 'react';
import './SelectOptionsForCourses.css'; // Import your custom CSS for styling (optional)

const SelectOptions = ({
  options, // Array of objects with `value` and `label` properties
  selectedValue, // Currently selected option value (optional)
  onOptionChange, // Function to handle option selection changes
  isCategories = false, // Flag to indicate category mode (optional)
  placeholderText = 'Select...', // Custom placeholder text (optional)
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef();

  const [internalSelectedValue, setInternalSelectedValue] = useState(selectedValue || ''); // Use initial selectedValue if provided

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onOptionChange(option.value); // Pass to parent component
    setIsOpen(false);
    setInternalSelectedValue(option.value); // Update local state
  };

  const handleDocumentClick = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener('click', handleDocumentClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
  
        <div className="courses custom-select d-flex align-items-start" onClick={toggleOptions} ref={selectRef}>
          <div className={`selected-option ${isOpen ? 'open' : ''}`}>
            {internalSelectedValue ? internalSelectedValue : placeholderText}
          </div>
          {isOpen && (
            <div className={`options ${isCategories ? 'categories' : 'custom-scrollbar'}`}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className="option"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
          <div className="custom-arrow" style={{ transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }` }} />
        
        </div>
  
  );
};

export default SelectOptions;
