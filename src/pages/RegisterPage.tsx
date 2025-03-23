// Desc: Register page for LexMedica
// ** React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useAuth } from "../hooks/useAuth";

// ** MUI Imports
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const { handleRegister, error, loading } = useAuth();
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const response = await handleRegister(email, password);
        if (response) {
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        }
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
                bgcolor: 'secondary.main'
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: 400,
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Daftar Akun LexMedica
                </Typography>

                {/* Registration Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
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
                        <Typography fontWeight={"bold"}> {loading ? "Loading" : "Daftar"} </Typography>
                    </Button>
                </Box>

                {/* Link to Login */}
                <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Typography variant="body1">
                            Sudah punya akun?{" "}
                            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Masuk di sini
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center">
                    <Grid item>
                        <Link to={'/'} >
                            <Button
                                variant="contained"
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography fontWeight={"bold"}>Akses Tanpa Akun</Typography>
                                <ArrowForwardIcon />
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RegisterPage;
