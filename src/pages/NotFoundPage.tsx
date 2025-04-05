import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
