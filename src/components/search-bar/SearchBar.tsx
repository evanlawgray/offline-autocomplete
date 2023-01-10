import { OptionsDataStore, SearchOption } from '@typesindex';
import React, { useCallback, useState } from 'react';

const INPUT_ID = 'search-input';

interface SearchBarProps {
  optionsDataStore: OptionsDataStore;
}

export const SearchBar = (props: SearchBarProps) => {
  console.log('TRIE:', JSON.stringify(props.optionsDataStore));
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist();
      const {
        target: { value: text }
      } = event;
      setSearchTerm(text);

      const newOptions = props.optionsDataStore.getAllWithPrefix(text);

      setOptions(newOptions ?? []);
    },
    [props.optionsDataStore, setSearchTerm, setOptions]
  );

  const handleSelect = useCallback(
    (text: string) => {
      setSearchTerm(text);
    },
    [props.optionsDataStore]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      props.optionsDataStore.insert(searchTerm);
    },
    [searchTerm, props.optionsDataStore]
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
