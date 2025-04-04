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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

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

    const validatePassword = (pwd: string) => {
        const validations = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            specialChar: /[^A-Za-z0-9]/.test(pwd),
        };
        setPasswordValidations(validations);
    };

    const allValid = Object.values(passwordValidations).every((v) => v);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                gap: 2,
                bgcolor: "secondary.main",
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            setIsEmailValid(emailRegex.test(value));
                        }}
                        error={!isEmailValid}
                        helperText={!isEmailValid ? "Format email tidak valid" : ""}
                    />

                    {/* Password input */}
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            validatePassword(value);
                        }}
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

                    {/* Password validation criteria */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Password harus terdiri dari minimal:</Typography>
                        {[
                            { label: "8 karakter", valid: passwordValidations.length },
                            { label: "1 huruf besar", valid: passwordValidations.uppercase },
                            { label: "1 huruf kecil", valid: passwordValidations.lowercase },
                            { label: "1 angka", valid: passwordValidations.number },
                            { label: "1 simbol", valid: passwordValidations.specialChar },
                        ].map((item, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    color: item.valid ? "green" : "gray",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {item.valid ? "✅" : "❌"} {item.label}
                            </Typography>
                        ))}
                    </Box>

                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={confirmPassword !== password}
                        helperText={
                            confirmPassword !== password ? "Password tidak cocok" : ""
                        }
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
                            Registrasi berhasil! Silakan cek email untuk verifikasi (jika tidak ada, cek folder spam)
                        </Alert>
                    )}

                    {/* Submit button */}
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ mt: 2 }}
                        disabled={
                            loading ||
                            email === "" ||
                            !isEmailValid ||
                            password === "" ||
                            confirmPassword !== password ||
                            !allValid
                        }
                    >
                        <Typography fontWeight={"bold"}>
                            {loading ? "Loading" : "Daftar"}
                        </Typography>
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
                        <Link to={"/"}>
                            <Button
                                variant="contained"
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
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
