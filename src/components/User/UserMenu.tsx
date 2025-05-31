import { useState, MouseEvent } from "react";
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import { useAuthContext } from "../../context/authContext";
import type { User } from "@supabase/supabase-js";

// Define the props interface
interface UserMenuProps {
    user: User
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const { handleLogout } = useAuthContext();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogLogoutOpen, setDialogLogoutOpen] = useState(false);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleOpenMenu}>
                <Avatar
                    sx={{
                        bgcolor: { xs: "white", md: "primary.main" },
                        color: { xs: "primary.main", md: "white" },
                        width: { xs: 32 },
                        height: { xs: 32 },
                        fontSize: { xs: '1rem' }
                    }}>
                    {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: { p: 1, minWidth: 200 },
                }}
            >
                <Typography sx={{ px: 2, fontWeight: "bold" }}>
                    {user.email}
                </Typography>
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        setDialogLogoutOpen(true);
                    }}
                    sx={{ mt: 1, color: "error.main", fontWeight: "bold" }}
                >
                    Logout
                </MenuItem>
            </Menu>

            <Dialog open={dialogLogoutOpen} onClose={() => setDialogLogoutOpen(false)}>
                <DialogTitle>Konfirmasi Logout</DialogTitle>
                <DialogContent>
                    <Typography>
                        Akses riwayat chat akan dihentikan, ingin tetap logout?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogLogoutOpen(false)} color="primary">
                        Batal
                    </Button>
                    <Button
                        onClick={() => {
                            setDialogLogoutOpen(false);
                            handleLogout();
                        }}
                        sx={{
                            bgcolor: "error.main",
                            "&:hover": { bgcolor: "error.dark" },
                            color: "white",
                        }}
                        variant="contained"
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserMenu;
