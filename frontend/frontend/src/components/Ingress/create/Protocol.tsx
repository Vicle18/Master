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
  TextField,
} from "@mui/material";
import { SelectorMenuProps } from "../../Overview/Topbar";
import { MQTT } from "./protocols/MQTT";
import { OPCUA } from "./protocols/OPCUA";
import { REST } from "./protocols/REST";

export const protocols = ["MQTT", "OPC UA", "REST"];
export var protocolName: string[];
var setProtocolName: React.Dispatch<React.SetStateAction<string[]>>;

export var host: string;
var setHost: React.Dispatch<React.SetStateAction<string>>;
export var port: string;
var setPort: React.Dispatch<React.SetStateAction<string>>;
export var topic: string;
export var setTopic: React.Dispatch<React.SetStateAction<string>>;

var valid: boolean;
var setValid: React.Dispatch<React.SetStateAction<boolean>>;

export function ProtocolSelector() {
  [protocolName, setProtocolName] = React.useState<string[]>([]);
  const [isOpenedMQTT, setIsOpenedMQTT] = React.useState(false);
  const [isOpenedREST, setIsOpenedREST] = React.useState(false);
  const [isOpenedOPCUA, setIsOpenedOPCUA] = React.useState(false);

  [host, setHost] = React.useState("");
  [port, setPort] = React.useState("");
  [valid, setValid] = React.useState(false);
  [topic, setTopic] = React.useState("");

  const handleChange = (event: SelectChangeEvent<typeof protocolName>) => {
    const {
      target: { value },
    } = event;
    setProtocolName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setIsOpenedOPCUA(false);
    setIsOpenedMQTT(false);
    setIsOpenedREST(false);

    if (value === "MQTT") {
      console.log(value);
      return setIsOpenedMQTT(true);
    } else if (value === "OPC UA") {
      return setIsOpenedOPCUA(true);
    } else if (value === "REST") {
      return setIsOpenedREST(true);
    }
  };

  return (
    <>
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
            value={protocolName}
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
      {isOpenedMQTT ? MQTT() : <></>}
      {isOpenedOPCUA ? OPCUA() : <></>}
      {isOpenedREST ? REST() : <></>}
    </>
  );
}
export function HostPort() {
  const handleValidation = (value: any) => {
    const reg = new RegExp("^([0-9]{1,3}.){3}[0-9]{1,3}$");
    setValid(reg.test(value));
    setHost(value);
    //setAnchorElNav(null);
  };
  return (
    <>
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
            marginRight: 11,
          }}
        >
          Host
        </FormLabel>
        <TextField
          autoFocus
          margin="normal"
          id="datapoint_id"
          label="Host IP"
          type="text"
          size="small"
          error={!valid}
          value={host}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleValidation(event.target.value);
          }}
        />
      </Box>
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
            marginRight: 11.3,
          }}
        >
          Port
        </FormLabel>
        <TextField
          autoFocus
          margin="normal"
          id="datapoint_id"
          label="Port"
          type="number"
          size="small"
          value={port}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPort(event.target.value);
          }}
        />
      </Box>
    </>
  );
}
