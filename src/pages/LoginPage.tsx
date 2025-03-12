import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Alert, InputAdornment, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple validation (for demo purposes)
        if (!email || !password) {
            setError("Silakan isi email dan password");
            setLoading(false);
            return;
        }

        try {
            // Simulate an API call for login
            const response = await fakeLoginApiCall(email, password);
            if (!response.success) {
                setError(response.message!);
            }
        } catch (error) {
            setError("Terjadi kesalahan, mohon coba lagi dalam beberapa saat");
        } finally {
            setLoading(false);
        }
    };

    // Simulate an API call (replace with actual API call)
    const fakeLoginApiCall = (email: string, password: string) => {
        return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
            setTimeout(() => {
                if (email === "test@example.com" && password === "password123") {
                    resolve({ success: true });
                } else if (email !== "test@example.com") {
                    resolve({ success: false, message: "Email belum terdaftar" });
                } else {
                    resolve({ success: false, message: "Password salah" });
                }
            }, 1500);
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {/* Custom title for LexMedica */}
            <Typography variant="h4" gutterBottom>
                Masuk ke LexMedica
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleLogin} sx={{ width: "100%", maxWidth: 400 }}>
                {/* Email input */}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error && !email}
                    helperText={error && !email ? "Email harus diisi" : ""}
                />

                {/* Password input */}
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error && !password}
                    helperText={error && !password ? "Password harus diisi" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Error message */}
                {error && (
                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Submit button */}
                <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading || email === "" || password === ""}
                    sx={{ mt: 2 }}
                >
                    {loading ? "Loading" : "Masuk"}
                </Button>
            </Box>

            {/* Link to Register */}
            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Grid item>
                    <Typography variant="body2">
                        Belum punya akun?{" "}
                        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                            Daftar di sini
                        </Link>
                    </Typography>
                </Grid>
            </Grid>

            <Grid container justifyContent="center">
                <Grid item>
                    <Link to={'/'}>
                        <Button
                            variant="contained"
                            fullWidth
                        >
                            {"AKSES TANPA AKUN"} <ArrowForwardIcon />
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Box >
    );
};

export default LoginPage;
