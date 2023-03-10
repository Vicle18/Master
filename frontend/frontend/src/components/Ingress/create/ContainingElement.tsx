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

export const containingElements = [
  "3151 Gripper",
  "2341 AMR",
  "3241 Gripper",
  "HMI",
  "ERP",
  "MES",
];
export var elementName: string[];
export var setElementName: React.Dispatch<React.SetStateAction<string[]>>
export function ContainingElementSelector() {
  [elementName, setElementName] = React.useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof elementName>) => {
    const {
      target: { value },
    } = event;
    setElementName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log(value);
  };

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
          value={elementName}
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
