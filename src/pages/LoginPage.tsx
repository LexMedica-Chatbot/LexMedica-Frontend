import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple validation (for demo purposes)
        if (!email || !password) {
            setError("Please enter both your email and password.");
            setLoading(false);
            return;
        }

        try {
            // Simulate an API call for login
            const response = await fakeLoginApiCall(email, password);
            if (!response.success) {
                setError("Login failed. Please check your credentials.");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
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
                    resolve({ success: false, message: "Email not registered." });
                } else {
                    resolve({ success: false, message: "Incorrect password." });
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
                Login to LexMedica
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center", mb: 3 }}>
                Access the latest legal and health documents for Indonesia. Please log in to continue.
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
                    helperText={error && !email ? "Email is required" : ""}
                />

                {/* Password input */}
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error && !password}
                    helperText={error && !password ? "Password is required" : ""}
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
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </Box>

            {/* Link to Register */}
            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Grid item>
                    <Typography variant="body2">
                        Don't have an account yet?{" "}
                        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                            Sign up here
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginPage;
