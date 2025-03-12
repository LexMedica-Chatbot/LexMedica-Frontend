// ** React Import
import { Link } from 'react-router-dom'

// ** MUI Import
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

// ** MUI Icons
import CreateIcon from '@mui/icons-material/Create';

const Navbar = () => {

    return (
        <Box sx={{ mb: 10 }}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left side buttons */}
                    <Box sx={{ display: 'flex' }}>
                        <Button
                            variant={"contained"}
                            sx={{ backgroundColor: 'black' }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <Typography fontWeight={'bold'}><CreateIcon /></Typography>
                        </Button>
                    </Box>

                    {/* Right side buttons (only visible on 'sm' and up) */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                        <Link to={'/login'}>
                            <Button
                                variant={"contained"}
                                sx={{ backgroundColor: 'black' }}
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <Typography fontWeight={'bold'}>Masuk</Typography>
                            </Button>
                        </Link>

                        <Link to={'/register'}>
                            <Button
                                variant={"contained"}
                                sx={{ backgroundColor: 'gray' }}
                                onClick={() => window.scrollTo(0, 0)}
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
