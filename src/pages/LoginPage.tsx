// Desc: Login page for LexMedica
// ** React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Context Imports
import { useAuthContext } from "../context/authContext";

// ** MUI Imports
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
    const navigate = useNavigate();
    const { handleLogin, error, loading } = useAuthContext();

    const [email, setEmail] = useState<string>("");
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleLogin(email, password);
        if (response) navigate("/");
    };

    return (
        <Box // Outermost container for the page
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                flexDirection: "column",
                p: { xs: 2, sm: 3, md: 4 },
                // Removed page background color
            }}
        >
            <Box // Form container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: { xs: 1.25, md: 1.5 },
                    backgroundColor: "white",
                    padding: { xs: 2.5, sm: 3, md: 4 },
                    borderRadius: 2,
                    boxShadow: { xs: 1, sm: 2, md: 3 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 450, md: 500 },
                }}
            >

                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                        textAlign: 'center',
                    }}
                >
                    Masuk ke LexMedica
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            setIsEmailValid(emailRegex.test(value));
                        }}
                        error={!isEmailValid}
                        helperText={!isEmailValid ? "Format email tidak valid" : ""}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "primary.main" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: { xs: 1.5, sm: 2 } }}>
                            {error}
                        </Alert>
                    )}

                    <Button // Submit button
                        variant="contained"
                        fullWidth
                        type="submit"
                        disabled={
                            loading ||
                            email === "" ||
                            !isEmailValid ||
                            password === ""
                        }
                        sx={{
                            mt: { xs: 2, sm: 2, md: 1.5 }, // Adjusted margin from last form element/error
                            py: { xs: 1, sm: 1.25 },
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                        }}
                    >
                        {loading ? "Loading" : "Masuk"}
                    </Button>
                </Box> {/* End of component="form" Box */}

                {/* Link to Register */}
                <Grid container justifyContent="center" sx={{ mt: 0 }}> {/* mt removed/set to 0, parent gap controls spacing */}
                    <Grid item>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Belum punya akun?{" "}
                            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 'medium' }}>
                                Daftar di sini
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>

                {/* Akses Tanpa Akun Button */}
                <Grid container justifyContent="center" sx={{ mt: 0, width: '100%' }}> {/* mt removed/set to 0 */}
                    <Grid item sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Link to={'/'} style={{ textDecoration: 'none', display: 'block' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1,
                                    py: { xs: 1, sm: 1.25 },
                                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                }}
                            >
                                Akses Tanpa Akun
                                <ArrowForwardIcon sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }} />
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box >
        </Box >
    );
};

export default LoginPage;