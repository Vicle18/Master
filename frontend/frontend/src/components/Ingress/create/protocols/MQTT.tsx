import * as React from "react";
import Box from "@mui/material/Box";
import { FormLabel, TextField } from "@mui/material";
import { HostPort, topic, setTopic } from "../Protocol";

export function MQTT() {
  return (
    <>
      {HostPort()}
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", alignItems: "center" },
          marginLeft: 5,
        }}
      >
        <FormLabel
          sx={{
            marginTop: 0.5,
            marginRight: 10.3,
          }}
        >
          Topic
        </FormLabel>
        <TextField
          autoFocus
          margin="normal"
          id="topic_id"
          label="Topic"
          type="value"
          size="small"
          value={topic}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTopic(event.target.value);
          }} />
      </Box>
    </>
  );
}
