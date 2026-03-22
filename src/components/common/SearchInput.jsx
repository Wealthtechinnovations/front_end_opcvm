import React, { useState, useCallback } from 'react';

const SearchInput = ({
  onSearch,
  placeholder = 'Rechercher...',
  debounceMs = 300,
  className = ''
}) => {
  const [value, setValue] = useState('');
  const timeoutRef = React.useRef(null);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`input-group ${className}`}>
      <span className="input-group-text bg-white">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button className="btn btn-outline-secondary" onClick={handleClear} type="button">
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
