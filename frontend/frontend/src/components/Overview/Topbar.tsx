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
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Theme";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const pages = ["Ingress", "Egress"];
const settings = ["Ingress", "Egress", "Containing Element"];
const test = ["Create"];

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.secondary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface Props {
  onIngressEgressButtonClick: (id: string) => void;
}

function TopBar(props: Props) {
  const [PopupIngress, setPopupIngress] = React.useState(false);
  const handlerClickOpen = () => {
    setPopupIngress(true);
  };

  const handlerClose = () => {
    console.log("handler close");
    setPopupIngress(false);
    console.log("after close");
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleIngressEgressButtonClick = (id: string) => {
    props.onIngressEgressButtonClick(id);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
                  onClick={() => handleIngressEgressButtonClick(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    backgroundColor: "primary",
                    marginLeft: 1,
                  }}
                >
                  {`${page}`}
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
                <MenuItem onClick={handlerClickOpen} disableRipple>
                  <EditIcon />
                  Ingress
                </MenuItem>
                {CreateIngress()}
                <MenuItem
                  onClick={() => {
                    handleClose("/CreateEgressPage");
                  }}
                  disableRipple
                >
                  <FileCopyIcon />
                  Egress
                </MenuItem>
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
                <MenuItem
                  onClick={() => {
                    handleClose("/CreateEgressPage");
                  }}
                  disableRipple
                >
                  <MoreHorizIcon />
                  More
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
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
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
