import { ClickAwayListener, List, ListItem, ListItemText, makeStyles, Paper, Popper, TextField, Theme } from '@mui/material';
import React, { useState } from 'react';


interface Props {
  suggestions: string[];
  onSearch: (query: string) => void;
}


const SearchBar: React.FC<Props> = ({ suggestions, onSearch }) => {
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
    setAnchorEl(event.target);
  };

  const handleListItemClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setAnchorEl(null);
  };

  return (
    <div >
      <TextField
        label="Search..."
        value={query}
        variant="filled"
        size="small"
        onChange={handleQueryChange}
        sx={{marginBottom: "10px"}}
        fullWidth
      />
      {/* <Popper open={!!anchorEl} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Paper>
            <List >
              {suggestions.map((suggestion) => (
                <ListItem
                  button
                  key={suggestion}
                  onClick={() => handleListItemClick(suggestion)}
                >
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper> */}
    </div>
  );
};

export default SearchBar;