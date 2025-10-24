import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import api from '../api/axios';
import { formatAUD } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const { isAdmin } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/recipes/${id}`);
      setRecipe(data);
    };
    load();
  }, [id]);

  if (!recipe) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{recipe.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAdmin && (
            <>
              <Button variant="contained" color="primary" onClick={() => navigate(`/recipes/edit/${id}`)}>
                Edit Recipe
              </Button>
              <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>
                Delete Recipe
              </Button>
            </>
          )}
          <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Category</Typography>
              <Typography variant="h6">{recipe.category || '-'}</Typography>
              <Typography color="text.secondary" sx={{ mt: 2 }}>Yield</Typography>
              <Typography variant="h6">{recipe.yield}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Ingredients</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell align="right">Cost (A$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipe.ingredients?.map((ing, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{ing.name}</TableCell>
                        <TableCell align="right">{ing.qty}</TableCell>
                        <TableCell>{ing.unit}</TableCell>
                        <TableCell align="right">{formatAUD(ing.cost || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Labour Cost</Typography>
                  <Typography variant="h6">{formatAUD(recipe.laborCost || 0)}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Total Cost</Typography>
                  <Typography variant="h6">{formatAUD(recipe.totalCost || 0)}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Selling Price</Typography>
                  <Typography variant="h6">{formatAUD(recipe.sellingPrice || 0)}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Margin</Typography>
                  <Typography variant="h6">{(recipe.margin ?? 0).toFixed(2)}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={async () => {
            try {
              await api.delete(`/recipes/${id}`);
              setConfirmOpen(false);
              navigate('/recipes');
            } catch (e) {
              setConfirmOpen(false);
            }
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeDetail;
