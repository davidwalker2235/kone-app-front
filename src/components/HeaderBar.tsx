import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

function ResponsiveAppBar() {

  return (
    <AppBar position="static" sx={{backgroundColor: 'lightgrey'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRric0VODcvFJkEWekuI43zg6Ebh54bXlMDlw&s'
                alt='kone-logo'
                loading="lazy"
                width='100px'
            />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;