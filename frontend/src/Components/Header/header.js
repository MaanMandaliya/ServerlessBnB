import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'


import { useNavigate } from 'react-router-dom'

const pages = ['Menu1', 'Menu2', 'Menu3']

const Header = () => {

  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null)

  
  

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null)
    if (page === 'Menu1') {
      navigate('/menu1')
    } else if (page === 'Menu2') {
      navigate('/menu2')
    } else if (page === 'Menu3') {
      navigate('/menu3')
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }



  const redirecToLogin = () => {
    console.log("Hello");
    navigate("../login");
  }

  const logout = () => {
    localStorage.setItem("group28-logged-in", false);
    localStorage.setItem("username", "");
    navigate("../login");
  }

  return (
    <AppBar sx={{ bgcolor: '#061423' }} position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'noto sans',
              fontWeight: 600,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Group28
          </Typography>

          <Box sx={{  display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu(page)
                  }}
                >
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant='h5'
            
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              
              fontFamily: 'noto sans',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Group28
          </Typography>
         

          <Box sx={{  display: { xs: 'none', md: 'flex' } }}>
            {/* TODO add necessary page menu options */}
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu(page)
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          
          {localStorage.getItem("group28-logged-in") == "true" ? (<Button onClick={logout} style={{  width: '30px', position: 'absolute', right: 0 }} color='inherit'>
            Logout
          </Button>) : (<Button onClick={redirecToLogin} style={{  width: '30px', position: 'absolute', right: 0 }} color='inherit'>
            Login
          </Button>)}

        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header