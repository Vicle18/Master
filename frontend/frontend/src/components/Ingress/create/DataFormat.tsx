import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { SelectorMenuProps } from "../../Overview/Topbar";

export const dataformats = [
  "String",
  "Raw",
  "JSON",
];


export function DataFormatSelector(

  dataformat: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void) {
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
          multiple
          value={dataformat}
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

export function formatChanger(elementName: string[], setFormatName: React.Dispatch<React.SetStateAction<string[]>>) {
  return (event: SelectChangeEvent<typeof elementName>) => {
    const {
      target: { value },
    } = event;
    setFormatName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
}