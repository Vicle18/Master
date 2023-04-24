import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Theme";
import { CreateEndpoint } from "./createEndpointMenu";
import { useNavigate } from "react-router-dom";
import ExportStepper from "../Export/ExportMenu";
import ImportMenu from "../Import/ImportMenu";

type TopBarProps = {
  onNavMenuClick: (page: string) => void;
};

const pages = ["Ingress", "Egress"];

const TopBar: React.FC<TopBarProps> = ({ onNavMenuClick }) => {
  const [openPage, setOpenPage] = React.useState<string>("Ingress");
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleCloseNavMenu = (page: any) => {
    // navigate(page);
    setOpenPage(page);
    setAnchorElNav(null);
    onNavMenuClick(page);
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
            <React.Fragment>
              {pages.map((page) => (
                <Button
                  id="ingress-egress-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  variant="contained"
                  disableElevation
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    backgroundColor: "primary",
                    marginLeft: 1,
                    borderBottom:
                      openPage === page ? "5px solid lightblue" : "none",
                  }}
                >
                  {page}
                </Button>
              ))}
            </React.Fragment>
            {CreateEndpoint(open, createClick, anchorEl, handleClose)}
            <ImportMenu />
            <ExportStepper />
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default TopBar;
