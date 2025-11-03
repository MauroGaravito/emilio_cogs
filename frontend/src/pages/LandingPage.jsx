import { Box, Button, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DEMO_URL = 'https://downundersolutions.com/contact-web-developer-blacktown';

const features = [
  {
    title: "Gestión de Recetas",
    description: "Crea, edita y organiza recetas con costos y rendimiento.",
  },
  {
    title: "Ingredientes & Costos",
    description: "Administra ingredientes, precios y calcula COGS automáticamente.",
  },
  {
    title: "Dashboard en Tiempo Real",
    description: "Indicadores clave y atajos para decisiones rápidas.",
  },
  {
    title: "Control de Accesos",
    description: "Perfiles y roles para mantener tu operación segura.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          background:
            'radial-gradient(60rem 60rem at 10% 20%, rgba(120, 120, 255, 0.15), rgba(0,0,0,0)),' +
            'radial-gradient(40rem 40rem at 90% 10%, rgba(0, 200, 255, 0.12), rgba(0,0,0,0))',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="img" src="/logo.png" alt="Emilio's COGS" sx={{ height: 36 }} />
                  <Typography variant="h5" color="text.secondary">Emilio's COGS</Typography>
                </Box>

                <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  Controla tus costos de cocina con precisión
                </Typography>

                <Typography variant="h6" color="text.secondary">
                  Una suite ligera para chefs y negocios gastronómicos: gestiona recetas, ingredientes y costos
                  en un solo lugar, con una interfaz rápida y clara.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button variant="contained" size="large" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="secondary"
                    component="a"
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Solicitar demo
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    color="info"
                    component="a"
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Access demo
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={6}
                sx={{ p: 3, borderRadius: 3, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(20,20,20,0.6)' }}
              >
                <Grid container spacing={2}>
                  {features.map((f) => (
                    <Grid item xs={12} sm={6} key={f.title}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{f.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.description}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer minimal */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Emilio's COGS
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button size="small" color="inherit" onClick={() => navigate('/login')}>
              Entrar al sistema
            </Button>
            <Button size="small" color="inherit" component="a" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              Solicitar demo
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;

