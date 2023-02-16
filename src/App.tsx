import React, { useState, useEffect } from 'react';

import { SearchBar } from '@components/search-bar';
import { initDB } from '@util/indexedDB';
import { prefixTreeSingleton } from '@util/prefix-tree';

import './App.css';

function App() {
  const [errors, setErrors] = useState<string[]>([]);

  const handleSetErrors = (errors: string | string[]) => {
    const newState: string[] = [];

    if (Array.isArray(errors)) {
      newState.concat(errors);
    }

    if (typeof errors === 'string') newState.push(errors);

    setErrors(newState);
  };

  // Initialize indexedDB instance on page load (must only be called once
  useEffect(() => {
    window.addEventListener('load', () => {
      initDB(handleSetErrors);
    });
  }, []);

  return (
    <div className="main-content">
      <SearchBar optionsDataStore={prefixTreeSingleton} />
    </div>
  );
}

export default App;
