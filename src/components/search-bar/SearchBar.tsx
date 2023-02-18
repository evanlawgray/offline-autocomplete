import { persistPrefixTree } from '@util/indexedDB/persistPrefixTree';
import { AutocompleteStore } from '@util/autocomplete-store';
import React, { useCallback, useState } from 'react';

const INPUT_ID = 'search-input';

interface ISearchBarProps {
  autoCompleteStore: typeof AutocompleteStore;
  setErrors: (errors: string | string[]) => void;
}

export const SearchBar = (props: ISearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist();

      const {
        target: { value: text }
      } = event;
      setSearchTerm(text);

      const newOptions = props.autoCompleteStore
        .getInstance()
        .getAllWithPrefix(text);

      setOptions(newOptions ?? []);
    },
    [props.autoCompleteStore, setSearchTerm, setOptions]
  );

  const handleSelect = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      props.autoCompleteStore.getInstance().insert(searchTerm);

      persistPrefixTree(
        props.autoCompleteStore.getInstance().toRawObject(),
        props.setErrors
      );
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
          {options.map((text) => (
            <li
              key={text}
              className="search-form__suggestions-list-item"
              onClick={() => handleSelect(text)}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};
