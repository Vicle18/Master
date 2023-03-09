import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";

export function InsertFrequency(handleClick: (event: React.MouseEvent<HTMLElement>) => void) {
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
        size="small" />
      <TextField
        autoFocus
        margin="normal"
        id="freq2_id"
        label="Modify"
        type="number"
        size="small"
        sx={{
          width: 100,
          marginLeft: 2
        }} />
    </Box>
  );
}
