import React, { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Toolbar,
  AppBar,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCash, IoMdPerson } from "react-icons/io";
import {
  MdGroup,
  MdOutlineContactSupport,
  MdBarChart,
  MdFolderSpecial,
  MdSecurityUpdateWarning,
} from "react-icons/md";
import {
  FaBitcoin,
  FaDollarSign,
  FaMoneyCheckAlt,
  FaTasks,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { LuBadgeDollarSign } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { HiMiniArrowTurnDownRight } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { setMobileOpen } from "../Redux/LayoutSlice";
import { logout } from "../Redux/LoginSlice";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "All Users", icon: <FaUsers />, path: "/all-users" },
  { text: "Packages Report", icon: <FaUsers />, path: "/upgrade-package" },
  { text: "Pending Withdrawal", icon: <FaUsers />, path: "/pending-withdrawal" },
  { text: "Download DB", icon: <FaUsers />, path: "/download-db" },
  {
    text: "Income",
    icon: <FaBitcoin />,
    path: "/income",
    children: [
      {
        text: "Referral Income",
        icon: <HiMiniArrowTurnDownRight />,
        path: "/income/referral",
      },
      {
        text: "Level Income",
        icon: <HiMiniArrowTurnDownRight />,
        path: "/income/level",
      },
      {
        text: "Matrix Income",
        icon: <HiMiniArrowTurnDownRight />,
        path: "/income/matrix",
      },
      {
        text: "Flush (Level) Income",
        icon: <HiMiniArrowTurnDownRight />,
        path: "/income/flush/level",
      },
      {
        text: "Flush (Matrix) Income",
        icon: <HiMiniArrowTurnDownRight />,
        path: "/income/flush/matrix",
      },
    ],
  },
  {
    text: "2FA Authentication",
    icon: <MdSecurityUpdateWarning />,
    path: "/admin/2fa-auth",
  },
  { text: "Logout", icon: <MdLogout />, path: "/" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mobileOpen = useSelector((state) => state.layout.mobileOpen);
  // const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  // console.log(mobileOpen)
  const handleDrawerToggle = () => {
    return dispatch(setMobileOpen(!mobileOpen));
  };

  const toggleSubmenu = (itemText) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const handleLogout = () => {
    dispatch(logout(false));
    navigate("/");
  };

  const handleNavClick = () => {
    if (isMobile) dispatch(setMobileOpen(false));
  };

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.path)) {
        setOpenSubmenus((prev) => ({ ...prev, [item.text]: true }));
      }
    });
  }, [location.pathname]);

  const listItemStyle = (selected, pl = 2) => ({
    pl,
    borderRadius: 1,
    my: 0.5,
    bgcolor: selected ? "#b7dccb" : "transparent",
    color: "#1a1a1a",
    "&:hover": {
      bgcolor: "#b7dccb",
    },
  });

  const NavItem = ({ item }) => {
    const isOpen = openSubmenus[item.text] || false;
    const isSelected = location.pathname === item.path;
    const isParentSelected =
      isSelected ||
      item.children?.some((child) => location.pathname === child.path);

    if (item.text === "Logout") {
      return (
        <ListItem button onClick={handleLogout} sx={listItemStyle(false)}>
          <ListItemIcon sx={{ color: "#1a1a1a" }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{ fontSize: "0.875rem" }}
          />
        </ListItem>
      );
    }

    if (item.children) {
      return (
        <Box key={item.text}>
          <ListItem
            button
            onClick={() => toggleSubmenu(item.text)}
            sx={listItemStyle(isParentSelected)}
          >
            <ListItemIcon sx={{ color: "#1a1a1a" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: "0.875rem" }}
            />
            {isOpen ? (
              <ExpandMoreIcon />
            ) : (
              <ExpandLess sx={{ rotate: "90deg" }} />
            )}
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem
                  key={child.text}
                  button
                  component={Link}
                  to={child.path}
                  selected={location.pathname === child.path}
                  onClick={handleNavClick}
                  sx={listItemStyle(location.pathname === child.path, 4)}
                >
                  <ListItemIcon sx={{ color: "#1a1a1a", minWidth: "30px" }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.text}
                    primaryTypographyProps={{ fontSize: "0.875rem" }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem
        button
        component={Link}
        to={item.path}
        selected={isSelected}
        onClick={handleNavClick}
        sx={listItemStyle(isSelected)}
      >
        <ListItemIcon sx={{ color: "#1a1a1a" }}>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{ fontSize: "0.875rem" }}
        />
      </ListItem>
    );
  };

  const drawerContent = useMemo(
    () => (
      <Box
        sx={{
          width: drawerWidth,
          p: 2,
          bgcolor: "#ffffff",
          height: "100%",
          color: "#1a1a1a",
          scrollbarWidth: "none",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: { xs: "none", md: "block" }, textAlign: "center" }}
        >
          {/* <img src="/images/LOGO.png" alt="Logo" style={{ maxWidth: "100%" }} /> */}
        </Typography>
        <List sx={{ marginTop: { xs: 5, md: 0 } }}>
          {navItems.map((item) => (
            <NavItem key={item.text} item={item} />
          ))}
        </List>
      </Box>
    ),
    [openSubmenus, location.pathname]
  );

  return (
    <>
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: "#1976d2",
            color: "white",
            boxShadow: "none",
            padding: "2px",
          }}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#000" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ marginLeft: "auto" }}>
              {/* <img
                src="/images/LOGO.png"
                alt="Logo"
                width="200px"
                height="auto"
              /> */}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {isMobile && <Toolbar />}

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#ffffff" },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#ffffff",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
