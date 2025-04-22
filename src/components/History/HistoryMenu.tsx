// ** React Imports
import React from "react";

// ** MUI Imports
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// ** Types Imports
import { ChatSession } from "../../types/Chat";

interface HistoryMenuProps {
    chatSessionsRef: React.RefObject<HTMLDivElement | null>;
    chatSessions: ChatSession[];
    selectedChatSessionId: number | null;
    onSelectChatSession: (chatId: number) => void;
    onMoreClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const HistoryMenu: React.FC<HistoryMenuProps> = ({ chatSessionsRef, chatSessions, selectedChatSessionId, onSelectChatSession, onMoreClick }) => {
    return (
        <>
            <Box
                ref={chatSessionsRef}
                sx={{
                    flex: 9,
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
                                    backgroundColor: selectedChatSessionId === chat.id ? "primary.main" : "transparent",
                                    color: selectedChatSessionId === chat.id ? "white" : "black",
                                }}
                                onClick={() => (
                                    onSelectChatSession(chat.id!)
                                )}
                            >
                                <Typography variant="body1" noWrap color="white">
                                    {chat.title}
                                </Typography>
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
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="gray" sx={{ textAlign: "center" }}>
                        Tidak ada riwayat chat
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default HistoryMenu;