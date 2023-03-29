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
  Menu,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import CreateEgressStepper from "../Egress/create/CreateEgressStepper";
import CreateContainingElementStepper from "../ContainingElement/CreateContainingElementStepper";
import CreateIngressStepper from "../Ingress/createv2/CreateIngressStepper";
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
  const [openSnackbar, setOpenSnackbar] = React.useState(true);
  const [PopupContainingElement, setPopupContainingElement] =
    React.useState(false);
  const [PopupEgress, setPopupEgress] = React.useState(false);

  const [result, setResult] = useState<string | null>(null);
  const handleSubmit = (name: string, description: string) => {
    // Send data to API
    console.log(`Submitting ${name} and ${description} to API`);
  };
  const handlerClickOpenContainingElement = () => {
    setPopupContainingElement(true);
  };
  const handlerClickOpenIngress = () => {
    setPopupIngress(true);
  };
  const handlerClickOpenEgress = () => {
    setPopupEgress(true);
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
          Ingress
        </MenuItem>

        <MenuItem onClick={handlerClickOpenEgress}>
          <AddCircleOutline />
          Egress
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handlerClickOpenContainingElement} disableRipple>
          <AddBox />
          Containing Element
        </MenuItem>
      </Menu>
      {CreateIngressStepper({ PopupIngress, setPopupIngress, handleResult })}
      {CreateContainingElementStepper({
        PopupContainingElement,
        setPopupContainingElement,
        handleResult,
      })}
      {CreateEgressStepper({ PopupEgress, setPopupEgress, handleResult })}
      {result && (
        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={result}
        >
          {result === "Network Error" ? (
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {result}
            </Alert>
          ) : (
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              {result}
            </Alert>
          )}
        </Snackbar>
      )}
    </div>
  );
}
