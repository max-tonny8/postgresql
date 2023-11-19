import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";

import Avatar from "@mui/material/Avatar";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CasinoIcon from "@mui/icons-material/Casino";

import LockOpenIcon from "@mui/icons-material/LockOpen";

import { RootState } from "../features/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useLogoutUserMutation } from "../features/slices/apiSlice";
import { logout } from "../features/slices/authSlice";

function Header() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = async () => {
    try {
      await logoutUser(userInfo).unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "purple", width: "100%" }}>
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CasinoIcon sx={{ display: "flex", mr: 1, ml: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BETS
          </Typography>
        </Link>

        {userInfo ? (
          <>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link
                  to={"/profile"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignContent: "center",
                      margin: "5px",
                    }}
                  >
                    <PersonIcon />
                    <Typography component="span" textAlign="center">
                      Profile
                    </Typography>
                  </Box>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Box
                  onClick={logoutHandler}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    alignContent: "center",
                    margin: "5px",
                  }}
                >
                  <LogoutIcon />
                  <Typography textAlign="center">Logout</Typography>
                </Box>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link
            to={"/login"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignContent: "center",
                margin: "5px",
                gap: "5px",
              }}
            >
              <LockOpenIcon />
              <Typography textAlign="center">Login/Register</Typography>
            </Box>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Header;
