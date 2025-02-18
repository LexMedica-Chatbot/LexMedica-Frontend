import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Chat from "../components/Chat/Chat"; // Import the Chat component

const Home = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            {/* AppBar */}
            <AppBar position="fixed">
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

            {/* Main Content - Pushes Chat down below AppBar */}
            <Box 
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: "64px", // Offset for AppBar (Toolbar height)
                    overflowY: "auto", // Page-level scroll
                }}
            >
                <Chat />
            </Box>
        </Box>
    );
};

export default Home;
