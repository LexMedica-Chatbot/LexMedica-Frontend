// Desc: Not Found Client page for LexMedica
// ** React Imports
import { useNavigate } from "react-router-dom";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

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
                textAlign: "center",
                px: 2,
            }}
        >
            <Card sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <Typography variant="h3" gutterBottom>
                    404 Not Found
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Halaman tidak ditemukan
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
                    Kembali
                </Button>
            </Card>
        </Box>
    );
};

export default NotFoundPage;
