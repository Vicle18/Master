import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { InsertId } from "./Id";
import { ContainingElementSelector, elementName } from "./ContainingElement";
import { id } from "./Id";
import { ProtocolSelector, protocolName, port, host } from "./Protocol";
import {
  InsertFrequency,
  standardFrequency,
  changedFrequency,
} from "./Frequency";
import { DataFormatSelector, formatName } from "./DataFormat";

interface Props {
  setPopupIngress: React.Dispatch<React.SetStateAction<boolean>>;
  PopupIngress: boolean;
}

const CreateIngress: React.FC<Props> = ({ setPopupIngress, PopupIngress }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlerCreate = () => {
    setPopupIngress(false);
    const endpoint = JSON.stringify({
      endpointID: id,
      frequency:
        changedFrequency.length === 0 ? standardFrequency : changedFrequency,
      formatName: formatName[0],
      elementName: elementName[0],
      protocolName: protocolName[0],
      host: host,
      port: port,
    });

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    axios
      .get("https://localhost:7033/api/Ingress", { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("https://localhost:7033/api/Ingress?=", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, Content-Type, X-Auth-Token, X-Requested-With",
      },
      body: endpoint,
    })
      .then((response) => response.json())
      .then((data) => console.log("data: " + data))
      .catch((error) => console.error(error));
  };

  const handlerClose = () => {
    setPopupIngress(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const validateInput = () => {
    if (
      id.length !== 0 &&
      elementName[0].length !== 0 &&
      protocolName[0].length !== 0 &&
      standardFrequency.length !== 0 &&
      formatName[0].length !== 0
    ) {
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <Dialog open={PopupIngress} onClose={handlerClose}>
        <DialogTitle>Create Ingress Datapoint</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>
            To create an Ingress Datapoint, please enter the following
            information.
          </DialogContentText>
          <Box onChange={validateInput}>
            {InsertId()}
            {ContainingElementSelector()}
            {ProtocolSelector()}
            {DataFormatSelector()}
            {InsertFrequency(handleClick)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlerClose}>Cancel</Button>
          <Button onClick={handlerCreate} disabled={isDisabled}>
            Create
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CreateIngress;
