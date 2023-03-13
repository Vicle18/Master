import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { SelectorMenuProps } from "../../Overview/Topbar";

export const dataformats = ["String", "Raw", "JSON"];
export var formatName: string[]
export var setFormatName: React.Dispatch<React.SetStateAction<string[]>>


export function DataFormatSelector() {
  [formatName, setFormatName] = React.useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof formatName>) => {
    const {
      target: { value },
    } = event;
    setFormatName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
        marginTop: 1,
      }}
    >
      <FormLabel
        sx={{
          marginRight: 8.3,
        }}
      >
        Data Format
      </FormLabel>
      <FormControl sx={{ m: 0.5, width: 200 }} size="small">
        <InputLabel>Select Data Format</InputLabel>
        <Select
          value={formatName}
          onChange={handleChange}
          input={<OutlinedInput label="Data Format" />}
          MenuProps={SelectorMenuProps}
        >
          {dataformats.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


