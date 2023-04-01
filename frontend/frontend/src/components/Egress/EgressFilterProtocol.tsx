import { Autocomplete, Box, Button, Chip, TextField } from "@mui/material";
import { useState } from "react";

interface SearchBarProps {

    onApply: (selected: string[]) => void;
}
interface Node {
    name: string;
    [key: string]: any;
  }


const EgressFilterProtocol: React.FC<SearchBarProps> = ({ onApply }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

  const options = ["MQTT", "OPCUA", "RTDE"];
  

  const handleAdd = () => {
    setSelected((prevSelected) => [...prevSelected, searchValue]);
    setSearchValue('');
  };

  const handleDelete = (chipToDelete: string) => {
    setSelected((prevSelected) =>
      prevSelected.filter((value) => value !== chipToDelete)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply(selected);
  };

  return (
    <form onSubmit={handleSubmit}>
      
        <Autocomplete
          freeSolo
          options={options}
          value={searchValue}
          onChange={(event, newValue) => {
            setSearchValue(newValue ?? '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      
      <Box mt={2}>
        {selected.map((value) => (
          <Chip
            key={value}
            label={value}
            onDelete={() => handleDelete(value)}
            color="primary"
            variant="outlined"
            style={{ marginRight: '5px', marginBottom: '5px' }}
          />
        ))}
      </Box>
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Apply
        </Button>
      </Box>
    </form>
  );
};

export default EgressFilterProtocol;