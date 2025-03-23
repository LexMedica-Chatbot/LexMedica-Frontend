// Desc: Login page for LexMedica
// ** React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();
    const { handleLogin, error, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleLogin(email, password);
        if (response) navigate("/");
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

                {/* Custom title for LexMedica */}
                <Typography variant="h4" gutterBottom>
                    Masuk ke LexMedica
                </Typography>

                {/* Form */}
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
                        <Typography fontWeight={"bold"}>{loading ? "Loading" : "Masuk"}</Typography>
                    </Button>
                </Box>

                {/* Link to Register */}
                <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Typography variant="body1">
                            Belum punya akun?{" "}
                            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Daftar di sini
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
            </Box >
        </Box >
    );
};

export default LoginPage;
