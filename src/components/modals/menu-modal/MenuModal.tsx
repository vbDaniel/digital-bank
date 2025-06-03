import { Menu, MenuItem } from "@mui/material";

import { ToggleProps } from "./MenuModal.types";

export default function MenuModal({
  open,
  disabledMenuItem,
  disabledMenuItemHouver,
  handleClose,
  handleActionClick,
  anchorEl,
  header,
  children,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  margin = "60px 0px 0px 0px",
}: ToggleProps) {
  return (
    <div>
      {header}
      <Menu
        id="basic-menu"
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        sx={{
          "& .MuiPaper-root": {
            margin: margin,
            borderRadius: "0px 0px 16px 16px", // reto no topo, arredondado só embaixo
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "2px solid #C3FF7E",
            width: "fit-content",
            boxShadow: "0px 4px 8px 4px rgba(195, 255, 126, 0.16)",
          },
          "& .MuiList-root": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {children}
      </Menu>
    </div>
  );
}
