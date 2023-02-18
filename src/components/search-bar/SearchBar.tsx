import React, { useCallback, useState } from 'react';

import { AutocompleteStore } from '@util/autocomplete-store';
import { persistPrefixTree } from '@util/indexedDB/persistPrefixTree';
import { SearchOption } from '@type/index';

const INPUT_ID = 'search-input';

interface ISearchBarProps {
  autoCompleteStore: typeof AutocompleteStore;
  setErrors: (errors: string | string[]) => void;
}

export const SearchBar = (props: ISearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<SearchOption[]>([]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist();

      const {
        target: { value: text }
      } = event;
      setSearchTerm(text);

      const newOptions = props.autoCompleteStore
        .getInstance()
        .getAllWithPrefix(text)
        .sort((optionA, optionB) => optionB.searchCount - optionA.searchCount);

      setOptions(newOptions ?? []);
    },
    [props.autoCompleteStore, setSearchTerm, setOptions]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      props.autoCompleteStore.getInstance().insert(searchTerm);

      persistPrefixTree(
        props.autoCompleteStore.getInstance().toRawObject(),
        props.setErrors
      );

      const newOptions = props.autoCompleteStore
        .getInstance()
        .getAllWithPrefix(searchTerm)
        .sort((optionA, optionB) => optionB.searchCount - optionA.searchCount);
      setOptions(newOptions);
    },
    [props.autoCompleteStore, props.setErrors, setOptions]
  );

  const handleSelect = useCallback((text: string) => {
    setSearchTerm(text);
    handleSearch(text);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      handleSearch(searchTerm);
    },
    [searchTerm, props.autoCompleteStore]
  );

  return (
    <form
      autoComplete="off"
      className="search-form__container"
      onSubmit={handleSubmit}
    >
      <label className="search-form__label" htmlFor={INPUT_ID}>
        Enter your search term...
      </label>
      <div className="search-form__input-wrapper">
        <input
          id={INPUT_ID}
          className="search-form__input"
          value={searchTerm}
          onChange={handleChange}
        />

        <ul className="search-form__suggestions-list">
          {options.map(({ searchTerm }) => (
            <li
              key={searchTerm}
              className="search-form__suggestions-list-item"
              onClick={() => handleSelect(searchTerm)}
            >
              {searchTerm}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};
