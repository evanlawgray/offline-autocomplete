import React, { useState, useEffect } from 'react';

import { SearchBar } from '@components/search-bar';
import { AutocompleteStore } from '@util/autocomplete-store';
import { initDB } from '@util/indexedDB';

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

  // Initialize indexedDB instance on page load and inject
  // stored values from indexedDB into in-memory Autocomplete store.
  useEffect(() => {
    window.addEventListener('load', () => {
      initDB(handleSetErrors);
    });
  }, []);

  return (
    <div className="main-content">
      <SearchBar
        autoCompleteStore={AutocompleteStore}
        setErrors={handleSetErrors}
      />
    </div>
  );
}

export default App;
