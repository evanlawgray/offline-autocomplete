import React from 'react';

import { SearchBar } from '@components/search-bar';
import { prefixTreeSingleton } from '@util/prefix-tree';

import './App.css';

function App() {
  return (
    <div className="main-content">
      <SearchBar optionsDataStore={prefixTreeSingleton} />
    </div>
  );
}

export default App;
