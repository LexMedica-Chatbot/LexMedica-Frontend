// ** React Imports
import React from "react";

// ** MUI Imports
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import DeleteIcon from '@mui/icons-material/Delete';

// ** Types Imports
import { ChatSession } from "../../types/Chat";

interface HistoryMoreOptionsProps {
    activeChatIndex: number | null;
    anchorElHistoryMoreOptions: HTMLElement | null;
    chatSessions: ChatSession[];
    onClose: () => void;
    onDelete: (sessionId: number) => void;
}

const HistoryMoreOptions: React.FC<HistoryMoreOptionsProps> = ({ activeChatIndex, anchorElHistoryMoreOptions, chatSessions, onClose, onDelete }) => {
    return (
        <>
            {/* Menu for More options */}
            <Menu
                anchorEl={anchorElHistoryMoreOptions}
                open={Boolean(anchorElHistoryMoreOptions)}
                onClose={onClose}
                MenuListProps={{ autoFocusItem: false }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }
                }
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        backgroundColor: "lightgray",
                        borderRadius: 2,
                        boxShadow: 3,
                    },
                }}
            >
                <MenuItem autoFocus={false} onClick={() => onDelete(chatSessions[activeChatIndex!].id!)}>
                    <DeleteIcon sx={{ mr: 1, color: 'red' }} />
                    <Typography variant="body2" color="red">Hapus</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default HistoryMoreOptions;