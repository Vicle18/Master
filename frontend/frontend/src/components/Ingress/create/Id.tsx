import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";
import { useId } from "react";
import { v4 as uuidv4 } from "uuid";

export var id: string;
var setID: React.Dispatch<React.SetStateAction<string>>;
export function InsertId() {
  [id, setID] = React.useState("");
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
        size="small"
        value={id}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setID(event.target.value);
        }}
      />
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
        onClick={() => setID(uuidv4())}
      >
        Generate
      </Button>
    </Box>
  );
}
