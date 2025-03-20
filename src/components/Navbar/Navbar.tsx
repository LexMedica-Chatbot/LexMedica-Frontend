// ** React Import
import { Link } from 'react-router-dom'

// ** MUI Import
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const Navbar = () => {

    return (
        <Box mb={8}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left side buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography fontWeight="bold" variant="h5">
                            LexMedica
                        </Typography>
                    </Box>

                    {/* Right side buttons */}
                    <Box sx={{ display: { xs: 'flex' }, gap: 2 }}>
                        <Link to={'/login'}>
                            <Button
                                variant={"contained"}
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <Typography fontWeight={'bold'}>Masuk</Typography>
                            </Button>
                        </Link>

                        <Link to={'/register'}>
                            <Button
                                variant={"outlined"}
                                onClick={() => window.scrollTo(0, 0)}
                                sx={{border: '2px solid'}}
                            >
                                <Typography fontWeight={'bold'}>Daftar</Typography>
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

    )
}

export default Navbar
