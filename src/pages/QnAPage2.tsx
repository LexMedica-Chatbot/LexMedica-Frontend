import { useState, useEffect, useRef } from "react";
import { Box, createTheme, Grid, Typography, List, ListItemButton, ListItemText, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import Navbar from "../components/Navbar/Navbar";
import { themeOptions } from "../configs/themeOptions";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface ChatHistory {
    title: string;
    messages: Message[];
}

const QnAPage2: React.FC = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex" }}>
            {/* Left Sidebar (First & Third Box) */}
            {isSidebarVisible && (
                <Grid
                    item
                    xs={2}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        transition: "width 0.3s ease",
                    }}
                >
                    {/* First Box */}
                    <Box sx={{ flex: 1, bgcolor: "yellow", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <IconButton onClick={toggleSidebar} sx={{ position: "absolute", left: 10 }}>
                            <MenuIcon />
                        </IconButton>
                        Riwayat Chat
                    </Box>

                    {/* Third Box */}
                    <Box sx={{ flex: 9, bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        Third Box
                    </Box>
                </Grid>
            )}

            {/* Right Content (Second & Fourth Box) */}
            <Grid
                item
                xs={isSidebarVisible ? 10 : 12}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.3s ease",
                }}
            >
                {/* Second Box */}
                <Box sx={{ flex: 1, bgcolor: "red", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {!isSidebarVisible && (
                        <IconButton onClick={toggleSidebar} sx={{ position: "absolute", left: 10 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    Second Box
                </Box>

                {/* Fourth Box */}
                <Box sx={{ flex: 9, bgcolor: "blue", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Fourth Box
                </Box>
            </Grid>
        </Grid>
    );
};

export default QnAPage2;
