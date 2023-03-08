import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Theme";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { isButtonElement } from "react-router-dom/dist/dom";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";
import { StyledMenu } from "./StyledMenu";

const pages = ["Ingress", "Egress"];
const settings = ["Ingress", "Egress", "Containing Element"];
const test = ["Create"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const SelectorMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
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
    setPopupEgress(false);
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
  const handleClose = (page: string) => {
    console.log("handle");
    // <ViewEgressPage title={"title"}></ViewEgressPage>;
    // <CreateEgress></CreateEgress>;
    console.log("After");
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="secondary"
              >
                <MenuIcon />
              </IconButton>
              <StyledMenu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </StyledMenu>
            </Box>
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
                onClick={handleClick}
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
                  <EditIcon />
                  Ingress
                </MenuItem>
                {CreateIngress()}
                
                <MenuItem onClick={handlerClickOpenEgress} disableRipple>
                  <EditIcon />
                  Egress
                </MenuItem>
                {CreateIngress()}

                <Divider sx={{ my: 0.5 }} />
                
                <MenuItem
                  onClick={() => {
                    handleClose("/CreateEgressPage");
                  }}
                  disableRipple
                >
                  <ArchiveIcon />
                  Containing Element
                </MenuItem>
              </StyledMenu>
            </div>
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
          <DialogContent>
            <DialogContentText>
              To create an Ingress Datapoint, please enter the following
              information.
            </DialogContentText>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", alignItems: "flex-end" },
              }}
            >
              <TextField
                autoFocus
                margin="normal"
                id="datapoint_id"
                label="Data Point ID"
                type="value"
                fullWidth
                variant="standard"
              />
              <Button
                id="generate-id-button"
                aria-haspopup="true"
                sx={{
                  color: "white",
                  backgroundColor: "primary",
                  marginLeft: 1,
                  marginBottom: 1,
                }}
                variant="contained"
                disableElevation
                onClick={handleClick}
              >
                Generate
              </Button>
            </Box>
            <Box
              marginTop={2}
              sx={{
                flexGrow: 1,
                display: { xs: "flex", alignItems: "flex-end" },
              }}
            >
              
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlerClose}>Cancel</Button>
            <Button onClick={handlerClose}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default TopBar;
