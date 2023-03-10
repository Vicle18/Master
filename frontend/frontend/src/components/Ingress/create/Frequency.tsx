import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";

export var standardFrequency: string;
var setStandardFrequency: React.Dispatch<React.SetStateAction<string>>;
export var changedFrequency: string;
var setChangeFrequency: React.Dispatch<React.SetStateAction<string>>;

export function InsertFrequency(handleClick: (event: React.MouseEvent<HTMLElement>) => void) {
  [standardFrequency, setStandardFrequency] = React.useState("");
  [changedFrequency, setChangeFrequency] = React.useState("");
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
      }}
    >
      <FormLabel
        sx={{
          marginTop: 0.5,
          marginRight: 10.6,
        }}
      >
        Frequency
      </FormLabel>
      <TextField
        autoFocus
        margin="normal"
        id="freq_id"
        label="Current Frequency"
        type="number"
        value={standardFrequency}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setStandardFrequency(event.target.value);
        }}
        size="small" />
      <TextField
        autoFocus
        margin="normal"
        id="freq2_id"
        label="Modify"
        type="number"
        size="small"
        value={changedFrequency}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setChangeFrequency(event.target.value);
        }}
        sx={{
          width: 100,
          marginLeft: 2
        }} />
    </Box>
  );
}
