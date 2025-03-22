import React from "react";
import { Drawer, Toolbar, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 0; // Sidebar width

interface DrawerMenuProps {
    isMobile: boolean;
    isDrawerOpen: boolean;
    handleDrawerToggle: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isMobile, isDrawerOpen, handleDrawerToggle }) => {
    return (
        <>
            {/* Permanent Drawer (Desktop) */}
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

            {/* Temporary Drawer (Mobile) */}
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
        </>
    );
};

export default DrawerMenu;
