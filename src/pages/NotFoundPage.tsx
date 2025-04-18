// Desc: Not Found Client page for LexMedica
// ** React Imports
import { useNavigate } from "react-router-dom";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "secondary.main",
                textAlign: "center",
                px: 2,
            }}
        >
            <Typography variant="h3" color="white" gutterBottom>
                404 Not Found
            </Typography>
            <Typography variant="h5" color="white" gutterBottom>
                Halaman tidak ditemukan
            </Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
                Kembali
            </Button>
        </Box>
    );
};

export default NotFoundPage;
