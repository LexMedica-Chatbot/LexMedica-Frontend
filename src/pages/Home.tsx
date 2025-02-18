import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";

import Chat from "../components/Chat"; // Import the Chat component


const drawerWidth = 240; // Sidebar width

const Home = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap>
                        Chatbot AI
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer - Always Open on Desktop, Toggles on Mobile */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
                    }}
                >
                    <Toolbar />
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chat History" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </List>
                </Drawer>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={isDrawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
                    }}
                >
                    <Toolbar />
                    <Divider />
                    <List>
                        <ListItem onClick={handleDrawerToggle}>
                            <ListItemIcon>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chat History" />
                        </ListItem>
                        <ListItem onClick={handleDrawerToggle}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </List>
                </Drawer>
            )}

            {/* Main Content - Adjusting Width Based on Sidebar */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: isMobile ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
                    transition: "width 0.3s ease-in-out",
                }}
            >
                <Toolbar />
                <Chat />
            </Box>
        </Box>
    );
};

export default Home;
