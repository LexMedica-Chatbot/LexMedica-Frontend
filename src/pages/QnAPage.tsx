import { useState } from "react";
import { Box, ListItemText, Divider, Button } from "@mui/material";
import Chat from "../components/Chat/Chat"; // Import the Chat component

const QnAPage = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null); // Store selected chat

    const handleNewChat = () => {
        setSelectedChat(null); // Reset chat selection to start a new one
    };

    const handleSelectChat = (chat: string) => {
        setSelectedChat(chat); // Load the selected chat history
    };

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh" }}>
                <Box
                    sx={{
                        width: "250px",
                        mt: "64px",
                        overflowY: "auto",
                    }}
                >
                    <Button onClick={handleNewChat}>
                        <ListItemText primary="New Chat" />
                    </Button>
                    <Divider />
                    <Button onClick={() => handleSelectChat("Chat 1")}>
                        <ListItemText primary="Chat 1" />
                    </Button>
                    <Divider />
                    <Button onClick={() => handleSelectChat("Chat 2")}>
                        <ListItemText primary="Chat 2" />
                    </Button>
                    <Divider />
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        mt: "64px",
                        overflowY: "auto",
                    }}
                >
                    {/* Chat Component */}
                    <Chat selectedChat={selectedChat} />
                </Box>
            </Box>
        </Box>

        // <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
        //     <Box sx={{ width: "250px", padding: 2 }}>
        //         <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
        //             <MenuIcon />
        //         </IconButton>
        //         <Typography variant="h6">Sidebar</Typography>
        //         <Divider />
        //         <List>
        //             {/* New Chat Button */}
        //             <ListItem onClick={handleNewChat}>
        //                 <ListItemText primary="New Chat" />
        //             </ListItem>

        //             {/* Chat History (Example list) */}
        //             <ListItem onClick={() => handleSelectChat("Chat 1")}>
        //                 <ListItemText primary="Chat 1" />
        //             </ListItem>
        //             <ListItem onClick={() => handleSelectChat("Chat 2")}>
        //                 <ListItemText primary="Chat 2" />
        //             </ListItem>
        //             {/* Add more chats here */}
        //         </List>
        //     </Box>

        //     {/* AppBar */}
        //     <Box position="fixed" >
        //         <Toolbar>
        //             <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
        //                 <MenuIcon />
        //             </IconButton>

        //             <Typography variant="h6" noWrap>
        //                 LexMedica
        //             </Typography>
        //         </Toolbar>
        //     </Box >

        //     {/* Main Content (Pushes Chat down below AppBar) */}
        //     <Box
        //         component="main"
        //         sx={{
        //             flexGrow: 1,
        //             mt: "64px", // Offset for AppBar (Toolbar height)
        //             overflowY: "auto", // Page-level scroll
        //             transition: "margin-left 0.3s", // Smooth transition for content shift
        //         }}
        //     >
        //         {/* Chat Component */}
        //         <Chat selectedChat={selectedChat} />
        //     </Box>
        // </Box >
    );
};

export default QnAPage;
