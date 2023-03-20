import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Theme";

import { CreateEndpoint } from "./createEndpointMenu";
import CreateIngress from "../Ingress/create/CreateIngress";
import CreateEgress from "../Egress/create/CreateEgress";
import CreateEgressStepper from "../Egress/create/CreateEgressStepper";
import CreateContainingElementStepper from "../ContainingElement/CreateContainingElementStepper";


const pages = ["Ingress", "Egress"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const SelectorMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 230,
    },
  },
};

function TopBar() {
  const [PopupIngress, setPopupIngress] = React.useState(false);
  const [PopupEgress, setPopupEgress] = React.useState(false);
  const [PopupContainingElement, setPopupContainingElement] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const handlerClickOpenIngress = () => {
    setPopupIngress(true);
  };

  /**
   * Create an endpoint based on the specified values
   */
  

  const handlerClickOpenEgress = () => {
    setPopupEgress(true);
  };
  const handlerClickOpenContainingElement = () => {
    setPopupContainingElement(true);
  };
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  

  const createClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (page: string) => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {addCreateDropDown(open, handleCloseNavMenu)}
            {CreateEndpoint(
              open,
              createClick,
              anchorEl,
              handleClose,
              handlerClickOpenIngress,
              PopupIngress,
              setPopupIngress,
              CreateIngress,
              PopupEgress,
              setPopupEgress,
              CreateEgressStepper,
              handlerClickOpenEgress,
              // PopupContainingElement,
              // setPopupContainingElement,
              // CreateContainingElementStepper,
              // handlerClickOpenContainingElement
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default TopBar;

function addCreateDropDown(open: boolean, handleCloseNavMenu: () => void) {
  return (
    <Box sx={{ display: "inline-flex" }}>
      {pages.map((page) => (
        <Button
          id="ingress-egress-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          variant="contained"
          disableElevation
          key={page}
          onClick={handleCloseNavMenu}
          sx={{
            my: 2,
            color: "white",
            display: "block",
            backgroundColor: "primary",
            marginLeft: 1,
          }}
        >
          {page}
        </Button>
      ))}
      
    </Box>
  );
}
