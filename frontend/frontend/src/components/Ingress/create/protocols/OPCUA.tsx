import * as React from "react";
import Box from "@mui/material/Box";
import { FormLabel, TextField } from "@mui/material";
import { HostPort, topic, setTopic } from "../Protocol";

export function OPCUA() {
  return (
    <>
      {HostPort()}
    </>
  );
}
