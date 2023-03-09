import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";

export function InsertId(handleClick: (event: React.MouseEvent<HTMLElement>) => void) {
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
          marginRight: 9.8,
        }}
      >
        Endpoint ID
      </FormLabel>
      <TextField
        autoFocus
        margin="normal"
        id="datapoint_id"
        label="Data Point ID"
        type="value"
        size="small" />
      <Button
        id="generate-id-button"
        aria-haspopup="true"
        sx={{
          color: "white",
          backgroundColor: "primary",
          marginLeft: 1,
          marginTop: 0.5,
        }}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        Generate
      </Button>
    </Box>
  );
}
