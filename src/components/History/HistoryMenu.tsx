// ** React Imports
import React from "react";

// ** MUI Imports
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// ** Types Imports
import { ChatSession } from "../../types/Chat";

interface HistoryMenuProps {
    chatSessionsRef: React.RefObject<HTMLDivElement | null>;
    chatSessions: ChatSession[];
    selectedChatSessionId: number | null;
    onClose: () => void;
    onSelectChatSession: (chatId: number) => void;
    onMoreClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const HistoryMenu: React.FC<HistoryMenuProps> = ({ chatSessionsRef, chatSessions, selectedChatSessionId, onClose, onSelectChatSession, onMoreClick }) => {
    return (
        <>
            <Box
                sx={{
                    py: 1,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    minHeight: 48, // Optional: ensures consistent height
                }}
            >
                {onClose && (
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "white",
                            position: "absolute",
                            left: 8, // or px
                        }}
                    >
                        <FormatListBulletedIcon />
                    </IconButton>
                )}
                <Typography
                    variant="h6"
                    fontSize="0.9rem"
                    fontWeight="bold"
                    color="white"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    Riwayat Chat
                </Typography>
            </Box>
            <Box
                ref={chatSessionsRef}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 2,
                    overflowY: "auto"
                }}>
                {chatSessions.length > 0 ? (
                    chatSessions.map((chat, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                "&:hover .more-icon": {
                                    visibility: "visible",
                                },
                            }}
                        >
                            <Button
                                fullWidth
                                variant={selectedChatSessionId === chat.id ? "contained" : "text"}
                                sx={{
                                    marginBottom: 1,
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    backgroundColor: selectedChatSessionId === chat.id ? "secondary.main" : "transparent",
                                    color: selectedChatSessionId === chat.id ? "#333333" : "white",
                                }}
                                onClick={() => (
                                    onSelectChatSession(chat.id!)
                                )}
                            >
                                {chat.title}
                            </Button>

                            {/* More icon, shown on hover */}
                            <IconButton
                                size="small"
                                onClick={(e) => onMoreClick(e, index)}
                                className="more-icon"
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    visibility: "hidden",
                                    color: "white",
                                }}
                            >
                                <MoreHorizIcon />
                            </IconButton>
                        </Box >
                    ))
                ) : (
                    <Typography variant="body2" color="white" sx={{ textAlign: "center" }}>
                        Tidak ada riwayat chat
                    </Typography>
                )}
            </Box >
        </>
    );
};

export default HistoryMenu;