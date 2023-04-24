import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./StyledMenu";
import { AddBox, AddCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Menu,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";

import CreateEgressStepper from "../Egress/create/CreateEgressStepper";
import CreateContainingElementStepper from "../ContainingElement/CreateContainingElementStepper";
import CreateIngressStepper from "../Ingress/createv2/CreateIngressStepper";
import ImportMenu from "../Import/ImportMenu";
import CreateEgressGroupStepper from "../EgressGroup/CreateEgressGroupStepper";
export function CreateEndpoint(
  open: boolean,
  createClick: (event: React.MouseEvent<HTMLElement>) => void,
  anchorEl: HTMLElement | null,
  handleClose: (page: string) => void
  // PopupContainingElement: boolean,
  // setPopupContainingElement: React.Dispatch<React.SetStateAction<boolean>>,
  // CreateContainingElement: React.FC<{
  //   PopupContainingElement: boolean;
  //   setPopupContainingElement: React.Dispatch<React.SetStateAction<boolean>>;
  //   handleResult: (result: string) => void;
  // }>,

  // handlerClickOpenContainingElement: () => void
) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PopupIngress, setPopupIngress] = React.useState(false);
  const [PopupEgressGroup, setPopupEgressGroup] = React.useState(false);

  const [openSnackbar, setOpenSnackbar] = React.useState(true);
  const [PopupContainingElement, setPopupContainingElement] =
    React.useState(false);
  const [PopupEgress, setPopupEgress] = React.useState(false);
  const [PopupImport, setPopupImport] = React.useState(false);


  const [result, setResult] = useState<string | null>(null);
  const handleSubmit = (name: string, description: string) => {
    // Send data to API
    console.log(`Submitting ${name} and ${description} to API`);
  };
  const handlerClickOpenContainingElement = () => {
    setPopupContainingElement(true);
  };

  const handlerClickOpenEgressGroup = () => {
    setPopupEgressGroup(true);
  };
  const handlerClickOpenIngress = () => {
    setPopupIngress(true);
  };
  const handlerClickOpenEgress = () => {
    setPopupEgress(true);
  };
  const handlerClickOpenImport = () => {
    setPopupImport(true);
  };
  const handleResult = (result: string) => {
    console.log(`Result: ${result}`);
    setOpenSnackbar(true);
    setResult(result);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          color: "white",
          backgroundColor: "primary",
          marginLeft: 1,
        }}
        variant="contained"
        disableElevation
        onClick={createClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Create
      </Button>

      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handlerClickOpenIngress} disableRipple>
          <AddCircleOutline />
          Ingress Endpoint
        </MenuItem>

        <MenuItem onClick={handlerClickOpenEgress}>
          <AddCircleOutline />
          Egress Endpoint
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handlerClickOpenContainingElement} disableRipple>
          <AddBox />
          Containing Element
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handlerClickOpenEgressGroup} disableRipple>
          <AddBox />
          Egress Group
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        
        {/* <MenuItem onClick={handlerClickOpenImport} disableRipple>
          <AddBox />
          Import Machine
        </MenuItem> */}
      </Menu>
      {/* <ImportMenu PopupImport={PopupImport} setPopupImport={setPopupImport}/> */}
      {CreateIngressStepper({ PopupIngress, setPopupIngress, handleResult })}
      {CreateContainingElementStepper({
        PopupContainingElement,
        setPopupContainingElement,
        handleResult,
      })}
      {CreateEgressGroupStepper({PopupEgressGroup, setPopupEgressGroup, handleResult})}
      {CreateEgressStepper({ PopupEgress, setPopupEgress, handleResult })}
      
    </div>
  );
}
