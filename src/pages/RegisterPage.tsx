import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Alert, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Simple validation
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Simulate an API call for registration
            const response = await fakeRegisterApiCall(email, password);
            if (response.success) {
                setSuccess(true);
                // Simulate sending the verification email
                setTimeout(() => {
                    alert(`A verification link has been sent to ${email}. Please check your inbox.`);
                    navigate("/login"); // Redirect to login page after registration
                }, 1500);
            } else {
                setError("response.message");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Simulate an API call (replace with actual API call)
    const fakeRegisterApiCall = (email: string, password: string) => {
        return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
            setTimeout(() => {
                // Simulate email validation
                if (email === "test@example.com") {
                    resolve({ success: false, message: "Email is already registered." });
                } else {
                    resolve({ success: true });
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
            <Typography variant="h4" gutterBottom>
                Daftar Akun LexMedica
            </Typography>

            {/* Registration Form */}
            <Box component="form" onSubmit={handleRegister} sx={{ width: "100%", maxWidth: 400 }}>
                {/* Email input */}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error && !email}
                    helperText={error && !email ? "Email is required" : ""}
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
                    helperText={error && !password ? "Password is required" : ""}
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

                {/* Confirm Password input */}
                <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!error && confirmPassword !== password}
                    helperText={error && confirmPassword !== password ? "Passwords do not match" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Error or Success Message */}
                {error && (
                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ marginBottom: 2 }}>
                        Registration successful! Please check your email for the verification link.
                    </Alert>
                )}

                {/* Submit button */}
                <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading || email === "" || password === "" || confirmPassword !== password}
                    sx={{ mt: 2 }}
                >
                    {loading ? "Loading" : "Daftar"}
                </Button>
            </Box>

            {/* Link to Login */}
            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Grid item>
                    <Typography variant="body2">
                        Sudah punya akun?{" "}
                        <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                            Masuk di sini
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
        </Box>
    );
};

export default RegisterPage;
