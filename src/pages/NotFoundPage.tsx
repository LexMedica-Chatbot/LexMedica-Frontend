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
                height: "calc(var(--vh, 1vh) * 100)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
            }}
        >
            <Card sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        mb: 2,
                    }}
                >
                    404 Not Found
                </Typography>
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                        mb: 2,
                    }}
                >
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
