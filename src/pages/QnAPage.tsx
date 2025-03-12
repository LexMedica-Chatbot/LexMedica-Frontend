import { useState } from "react";
import { Box } from "@mui/material";
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
        <Box
            sx={{
                flexGrow: 1,
                overflowY: "auto",
                width: "80%"
            }}
        >
            {/* Chat Component */}
            <Chat selectedChat={selectedChat} />
        </Box>
    );
};

export default QnAPage;
