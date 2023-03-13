import * as React from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./StyledMenu";
import { AddBox, AddCircleOutline } from "@mui/icons-material";

export function createEndpoint(open: boolean, createClick: (event: React.MouseEvent<HTMLElement>) => void, anchorEl: HTMLElement | null, handleClose: (page: string) => void, handlerClickOpenIngress: () => void, CreateIngress: () => JSX.Element, handlerClickOpenEgress: () => void) {
  return <div>
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
      {CreateIngress()}

      <MenuItem onClick={handlerClickOpenEgress} disableRipple>
        <AddCircleOutline />
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
        <AddBox />
        Containing Element
      </MenuItem>
    </StyledMenu>
  </div>;
}
