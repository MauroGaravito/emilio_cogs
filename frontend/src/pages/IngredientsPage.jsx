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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { formatAUD } from '../utils/formatCurrency';

const emptyIng = { name: '', unit: 'kg', unitCost: 0, supplier: '' };

const IngredientsPage = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyIng);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/ingredients');
      setItems(data);
    } catch (err) {
      toast.error('Failed to load ingredients');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (ing = emptyIng) => {
    setEditingId(ing._id || null);
    setForm({ name: ing.name || '', unit: ing.unit || 'kg', unitCost: ing.unitCost || 0, supplier: ing.supplier || '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const save = async () => {
    try {
      if (editingId) {
        await api.put(`/ingredients/${editingId}`, form);
        toast.success('Ingredient updated');
      } else {
        await api.post('/ingredients', form);
        toast.success('Ingredient created');
      }
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ingredients</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={() => handleOpen()}>
            New Ingredient
          </Button>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Unit Cost (A$)</TableCell>
              <TableCell>Supplier</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((i) => (
              <TableRow key={i._id} hover>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.unit}</TableCell>
                <TableCell align="right">{formatAUD(i.unitCost)}</TableCell>
                <TableCell>{i.supplier}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpen(i)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Ingredient' : 'New Ingredient'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select labelId="unit-label" label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="pcs">pcs</MenuItem>
              </Select>
            </FormControl>
            <TextField type="number" inputProps={{ step: '0.01' }} label="Unit Cost (A$)" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })} />
            <TextField label="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
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

export default IngredientsPage;
