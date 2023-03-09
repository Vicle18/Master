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
import { SelectorMenuProps} from "../../Overview/Topbar";

export const containingElements = [
  "Container1",
  "Container2",
  "Container3",
  "Container4",
  "Container5",
  "Container6",
];

export function ContainingElementSelector(
  personName: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
      }}
    >
      <FormLabel
        sx={{
          marginRight: 2,
        }}
      >
        Containing Element
      </FormLabel>
      <FormControl sx={{ m: 0.5, width: 200 }} size="small">
        <InputLabel>Select Element</InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Containing Element" />}
          MenuProps={SelectorMenuProps}
        >
          {containingElements.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export function elementChanger(elementName: string[], setPersonName: React.Dispatch<React.SetStateAction<string[]>>) {
  return (event: SelectChangeEvent<typeof elementName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
}