import React from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  LinearProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTransition } from "@remix-run/react";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;

  children: React.ReactNode;
}

const drawerWidth = 240;
const navItems = [{
  title: 'Home',
  link: '/todos'
}, {
   title: 'Todos With A',
  link: '/todos/todos-with-a'
}];

export const Layout: React.FC<Props> = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const transition = useTransition();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Test
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} href={item.link}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Test
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.link} sx={{ color: '#fff' }} href={item.link}>
                {item.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>


      {transition.state === 'loading' && (
        <LinearProgress
          color="secondary"
          sx={{
            position: 'absolute',
            top: 60,
            left: 0,
            zIndex: 'tooltip',
            width: '100%'
          }}
        />
      )}

      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
