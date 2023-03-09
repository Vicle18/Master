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
  FormLabel,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";
import { StyledMenu } from "./StyledMenu";
import { Label } from "@mui/icons-material";

const pages = ["Ingress", "Egress"];
const settings = ["Ingress", "Egress", "Containing Element"];
const test = ["Create"];

const names = [
  "Container1",
  "Container2",
  "Container3",
  "Container4",
  "Container5",
  "Container6",
];

const protocols = [
  "MQTT",
  "OPC UA",
  "ROS2",
];

const dataformats = [
  "String",
  "Raw",
  "JSON",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const SelectorMenuProps = {
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
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [protocolName, setProtocolName] = React.useState<string[]>([]);
  const [formatName, setFormatName] = React.useState<string[]>([]);

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
  const handleElementChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleProtocolChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setProtocolName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleFormatChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setFormatName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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
          <DialogContent dividers={true}>
            <DialogContentText>
              To create an Ingress Datapoint, please enter the following
              information.
            </DialogContentText>
            {InsertId(handleClick)}
            {ContainingElementSelector(personName, handleElementChange)}
            {ProtocolSelector(protocolName, handleProtocolChange)}
            {InsertFrequency(handleClick)}
            {DataFormatSelector(formatName, handleFormatChange)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handlerClose}>Cancel</Button>
            <Button onClick={handlerClose}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default TopBar;

function InsertId(handleClick: (event: React.MouseEvent<HTMLElement>) => void) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
      }}
    >
      <FormLabel
        sx={{
          marginTop: 0.5,
          marginRight: 9.8,
        }}
      >
        Endpoint ID
      </FormLabel>
      <TextField
        autoFocus
        margin="normal"
        id="datapoint_id"
        label="Data Point ID"
        type="value"
        size="small"
      />
      <Button
        id="generate-id-button"
        aria-haspopup="true"
        sx={{
          color: "white",
          backgroundColor: "primary",
          marginLeft: 1,
          marginTop: 0.5,
        }}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        Generate
      </Button>
    </Box>
  );
}

function ContainingElementSelector(
  personName: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void
) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
      }}
    >
      <FormLabel
        sx={{
          marginRight: 2,
        }}
      >
        Containing Element
      </FormLabel>
      <FormControl sx={{ m: 0.5, width: 200 }} size="small">
        <InputLabel>Select Element</InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Containing Element" />}
          MenuProps={SelectorMenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function ProtocolSelector(
  personName: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void
) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
        marginTop:1,
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
          multiple
          value={personName}
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
  );
}

function InsertFrequency(handleClick: (event: React.MouseEvent<HTMLElement>) => void) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
      }}
    >
      <FormLabel
        sx={{
          marginTop: 0.5,
          marginRight: 10.6,
        }}
      >
        Frequency
      </FormLabel>
      <TextField
        autoFocus
        margin="normal"
        id="freq_id"
        label="Current Frequency"
        type="value"
        size="small"
      />
      <TextField
        autoFocus
        margin="normal"
        id="freq2_id"
        label="Modify"
        type="value"
        size="small"
        sx={{
          width:100,
          marginLeft:2
        }}
      />
    </Box>
  );
}

function DataFormatSelector(
  dataformat: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void
) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", alignItems: "center" },
        marginTop:1,
      }}
    >
      <FormLabel
        sx={{
          marginRight: 8.3,
        }}
      >
        Data Format
      </FormLabel>
      <FormControl sx={{ m: 0.5, width: 200 }} size="small">
        <InputLabel>Select Data Format</InputLabel>
        <Select
          multiple
          value={dataformat}
          onChange={handleChange}
          input={<OutlinedInput label="Data Format" />}
          MenuProps={SelectorMenuProps}
        >
          {dataformats.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
