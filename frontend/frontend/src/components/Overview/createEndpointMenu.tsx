import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./StyledMenu";
import { AddBox, AddCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import CreateEgress from "../Egress/create/CreateEgress";
import CreateEgressStepper from "../Egress/create/CreateEgress copy";
export function CreateEndpoint(
  open: boolean,
  createClick: (event: React.MouseEvent<HTMLElement>) => void,
  anchorEl: HTMLElement | null,
  handleClose: (page: string) => void,
  handlerClickOpenIngress: () => void,
  PopupIngress: boolean,
  setPopupIngress: React.Dispatch<React.SetStateAction<boolean>>,
  CreateIngress: React.FC<{
    PopupIngress: boolean;
    setPopupIngress: React.Dispatch<React.SetStateAction<boolean>>;
  }>,
  PopupEgress: boolean,
  setPopupEgress: React.Dispatch<React.SetStateAction<boolean>>,
  CreateEgress: React.FC<{
    PopupEgress: boolean;
    setPopupEgress: React.Dispatch<React.SetStateAction<boolean>>;
    handleResult: (result: string) => void;
  }>,

  handlerClickOpenEgress: () => void
) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(true);

  const [result, setResult] = useState<string | null>(null);
  const handleSubmit = (name: string, description: string) => {
    // Send data to API
    console.log(`Submitting ${name} and ${description} to API`);
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
      <StyledMenu
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
        {CreateIngress({ PopupIngress, setPopupIngress })}

        <MenuItem onClick={handlerClickOpenEgress} disableRipple>
          <AddCircleOutline />
          Egress
        </MenuItem>
        {CreateEgressStepper({ PopupEgress, setPopupEgress, handleResult })}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            handleClose("/CreateEgressPage");
          }}
          disableRipple
        >
          <AddBox />
          Containing Element
        </MenuItem>
      </StyledMenu>
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
