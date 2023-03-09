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

export const protocols = [
  "MQTT",
  "OPC UA",
  "ROS2",
];

export function ProtocolSelector(
  personName: string[],
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
          marginRight: 12.3,
        }}
      >
        Protocol
      </FormLabel>
      <FormControl sx={{ m: 0.5, width: 200 }} size="small">
        <InputLabel>Select Protocol</InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Containing Element" />}
          MenuProps={SelectorMenuProps}
        >
          {protocols.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export function protocolChanger(elementName: string[], setProtocolName: React.Dispatch<React.SetStateAction<string[]>>) {
  return (
    event: SelectChangeEvent<typeof elementName>
  ) => {
    const {
      target: { value },
    } = event;
    setProtocolName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
}