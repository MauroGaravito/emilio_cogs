import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 220;

const Layout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { text: 'Dashboard', to: '/dashboard' },
    { text: 'Recipes', to: '/recipes' },
    { text: 'Ingredients', to: '/ingredients' },
  ];

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
          <Box component="img" src="/logo.png" alt="Emilio's COGS" sx={{ height: 28, width: 'auto' }} />
          <Typography variant="subtitle1" noWrap>Emilio's COGS</Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menu.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.to} selected={location.pathname === item.to}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => { logout(); navigate('/login'); }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box flexGrow={1} sx={{ ml: `${drawerWidth}px` }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Toolbar>
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 28, width: 'auto', mr: 1, display: { xs: 'none', sm: 'block' } }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Emilio's COGS System</Typography>
            {user && (
              <Typography variant="body2">{user.name} ({user.role})</Typography>
            )}
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Container sx={{ py: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
