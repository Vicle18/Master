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
            margin="normal"
            variant="outlined"
            size="small"

          />
        )}
      />
      <Box mt={0.1} display="flex">
        {selected.map((value) => (
          <Chip
            key={value}
            label={value}
            size="small"
            onDelete={() => handleDelete(value)}
            color="primary"
            variant="outlined"
            style={{ marginRight: '3px', marginBottom: '3px' }}
          />
        ))}
      </Box>
      <Button type="submit" variant="contained" color="primary" onClick={handleAdd} size="small">
        Apply
      </Button>


    </form>
  );
};

export default EgressFilterProtocol;