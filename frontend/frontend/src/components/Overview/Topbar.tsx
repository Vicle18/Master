import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Theme";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { StyledMenu } from "./StyledMenu";
import { InsertId } from "../Ingress/create/Id";
import {
  ContainingElementSelector,
  elementName,
} from "../Ingress/create/ContainingElement";
import { id } from "../Ingress/create/Id";
import {
  ProtocolSelector,
  protocolName,
  topic,
  port,
  host,
} from "../Ingress/create/Protocol";
import {
  InsertFrequency,
  standardFrequency,
  changedFrequency,
} from "../Ingress/create/Frequency";
import { DataFormatSelector, formatName, dataformats } from "../Ingress/create/DataFormat";
import { createEndpoint } from "./createEndpointMenu";

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

  const handlerClickOpenIngress = () => {
    setPopupIngress(true);
  };

  const handlerClose = () => {
    setPopupIngress(false);
  };

  const handlerCreate = () => {
    setPopupIngress(false);

    // changedFrequency,
    // standardFrequency,
    //formatName
    //protocolName
    //elementName
    //id
  };

  const handlerClickOpenEgress = () => {
    setPopupEgress(true);
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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
            {createEndpoint(
              open,
              createClick,
              anchorEl,
              handleClose,
              handlerClickOpenIngress,
              CreateIngress,
              handlerClickOpenEgress
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );

  function CreateIngress() {
    return (
      <div>
        <Dialog open={PopupIngress} onClose={handlerClose}>
          <DialogTitle>Create Ingress Datapoint</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText>
              To create an Ingress Datapoint, please enter the following
              information.
            </DialogContentText>
            {InsertId()}
            {ContainingElementSelector()}
            {ProtocolSelector()}
            {InsertFrequency(handleClick)}
            {DataFormatSelector()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handlerClose}>Cancel</Button>
            <Button onClick={handlerCreate}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
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
