import { useEffect, useRef, useState } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export type SearchFieldProps = Omit<TextFieldProps, 'onChange'> & {
  /** Controlled value. */
  value?: string;
  /** Fires with the current text; debounced by `debounceMs`. */
  onSearch?: (value: string) => void;
  /** Debounce delay in ms before `onSearch` fires. Default 300. */
  debounceMs?: number;
};

/**
 * Search text field built on MUI v7 TextField with a leading search icon,
 * a clear button, and debounced change notifications.
 */
export function SearchField({
  value,
  onSearch,
  debounceMs = 300,
  placeholder = 'Search…',
  ...rest
}: SearchFieldProps) {
  const [internal, setInternal] = useState(value ?? '');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const emit = (next: string) => {
    setInternal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(next), debounceMs);
  };

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    setInternal('');
    onSearch?.('');
  };

  return (
    <TextField
      {...rest}
      value={internal}
      placeholder={placeholder}
      onChange={(e) => emit(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: internal ? (
            <InputAdornment position="end">
              <IconButton aria-label="clear search" size="small" onClick={clear} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}

export default SearchField;
