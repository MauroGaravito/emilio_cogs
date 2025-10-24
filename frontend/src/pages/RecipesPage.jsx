import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { formatAUD } from '../utils/formatCurrency';

const emptyRecipe = {
  name: '',
  category: '',
  yield: 1,
  ingredients: [],
  laborCost: 0,
  sellingPrice: 0,
};

const RecipesPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/recipes');
      setRecipes(data);
    } catch (err) {
      toast.error('Failed to load recipes');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (rec = emptyRecipe) => {
    setEditingId(rec._id || null);
    setForm({
      name: rec.name || '',
      category: rec.category || '',
      yield: rec.yield || 1,
      ingredients: rec.ingredients || [],
      laborCost: rec.laborCost || 0,
      sellingPrice: rec.sellingPrice || 0,
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const save = async () => {
    try {
      if (editingId) {
        await api.put(`/recipes/${editingId}`, form);
        toast.success('Recipe updated');
      } else {
        await api.post('/recipes', form);
        toast.success('Recipe created');
      }
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('Recipe deleted');
      await load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Recipes</Typography>
        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => navigate('/recipes/new')}>
              New Recipe
            </Button>
            <Button variant="outlined" onClick={() => handleOpen()}>
              Quick Create
            </Button>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Total Cost (A$)</TableCell>
              <TableCell align="right">Selling Price (A$)</TableCell>
              <TableCell align="right">Margin (%)</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((r) => (
              <TableRow key={r._id} hover>
                <TableCell>
                  <Link to={`/recipes/${r._id}`} style={{ textDecoration: 'none', color: '#90caf9' }}>
                    {r.name}
                  </Link>
                </TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell align="right">{formatAUD(r.totalCost)}</TableCell>
                <TableCell align="right">{formatAUD(r.sellingPrice)}</TableCell>
                <TableCell align="right">{r.margin}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/recipes/edit/${r._id}`)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => remove(r._id)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Recipe' : 'New Recipe'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <TextField type="number" label="Yield" value={form.yield} onChange={(e) => setForm({ ...form, yield: Number(e.target.value) })} />
            <TextField type="number" inputProps={{ step: '0.01' }} label="Labor Cost (A$)" value={form.laborCost} onChange={(e) => setForm({ ...form, laborCost: Number(e.target.value) })} />
            <TextField type="number" inputProps={{ step: '0.01' }} label="Selling Price (A$)" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} />
      </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isAdmin && <Button variant="contained" onClick={save}>Save</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipesPage;
