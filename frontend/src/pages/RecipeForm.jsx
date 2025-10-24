import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { formatAUD } from '../utils/formatCurrency';

const RecipeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [catalog, setCatalog] = useState([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [yieldCount, setYieldCount] = useState(1);
  const [laborCost, setLaborCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [rows, setRows] = useState([{ ingredientName: '', qty: 0, unit: '', unitCost: 0, cost: 0 }]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/ingredients');
      setCatalog(data);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const fetchRecipe = async () => {
      const { data } = await api.get(`/recipes/${id}`);
      setName(data.name || '');
      setCategory(data.category || '');
      setYieldCount(data.yield || 1);
      setLaborCost(data.laborCost || 0);
      setSellingPrice(data.sellingPrice || 0);
      // map server ingredients to form rows
      setRows(
        (data.ingredients || []).map((ing) => {
          const cat = catalog.find((c) => c.name === ing.name);
          const unitCost = cat?.unitCost ?? 0;
          const computedCost = Number(((ing.qty || 0) * (unitCost || 0)).toFixed(2));
          return {
            ingredientName: ing.name,
            qty: ing.qty || 0,
            unit: ing.unit || cat?.unit || '',
            unitCost,
            cost: unitCost ? computedCost : (ing.cost || 0),
          };
        })
      );
    };
    fetchRecipe();
    // we intentionally exclude catalog from deps to avoid double loads; 
    // user can re-select ingredients to refresh unitCost if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const onChangeRowIngredient = (index, ingredientName) => {
    setRows((prev) => {
      const copy = [...prev];
      const ing = catalog.find((i) => i.name === ingredientName);
      copy[index].ingredientName = ingredientName;
      copy[index].unit = ing?.unit || '';
      copy[index].unitCost = ing?.unitCost || 0;
      const qty = Number(copy[index].qty) || 0;
      copy[index].cost = Number((qty * (copy[index].unitCost || 0)).toFixed(2));
      return copy;
    });
  };

  const onChangeRowQty = (index, qty) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index].qty = Number(qty) || 0;
      copy[index].cost = Number(((copy[index].qty || 0) * (copy[index].unitCost || 0)).toFixed(2));
      return copy;
    });
  };

  const addRow = () => setRows((prev) => [...prev, { ingredientName: '', qty: 0, unit: '', unitCost: 0, cost: 0 }]);
  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));
  // v6 aliases for clarity with spec
  const addIngredient = () => addRow();
  const removeIngredient = (index) => removeRow(index);

  const ingredientsCost = useMemo(() => rows.reduce((s, r) => s + (Number(r.cost) || 0), 0), [rows]);
  const totalCost = useMemo(() => Number((ingredientsCost + (Number(laborCost) || 0)).toFixed(2)), [ingredientsCost, laborCost]);
  const margin = useMemo(() => {
    const sp = Number(sellingPrice) || 0;
    if (!sp) return 0;
    return Number((((sp - totalCost) / sp) * 100).toFixed(2));
  }, [sellingPrice, totalCost]);

  // v6: ensure recalculation happens after add/remove actions
  // useMemo above handles it; keeping effect for clarity with spec
  useEffect(() => {
    // recalculation is derived; no-op needed here
  }, [rows, laborCost, sellingPrice]);

  const save = async () => {
    try {
      setSaving(true);
      const body = {
        name,
        category,
        yield: yieldCount,
        ingredients: rows
          .filter((r) => r.ingredientName)
          .map((r) => ({ name: r.ingredientName, qty: r.qty, unit: r.unit, cost: r.cost })),
        laborCost: Number(laborCost) || 0,
        sellingPrice: Number(sellingPrice) || 0,
      };
      if (isEdit) {
        await api.put(`/recipes/${id}`, body);
      } else {
        await api.post('/recipes', body);
      }
      navigate('/recipes');
    } catch (err) {
      // no toast here to keep the page simple; RecipesPage handles list feedback
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>{isEdit ? 'Edit Recipe' : 'New Recipe'}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                <TextField type="number" label="Yield" value={yieldCount} onChange={(e) => setYieldCount(Number(e.target.value) || 0)} />
                <TextField type="number" inputProps={{ step: '0.01' }} label="Labor Cost (A$)" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} />
                <TextField type="number" inputProps={{ step: '0.01' }} label="Selling Price (A$)" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography sx={{ mb: 1 }}>Ingredients</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {rows.map((row, idx) => (
                  <Grid key={idx} container spacing={1} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <TextField
                        select
                        fullWidth
                        label="Ingredient"
                        value={row.ingredientName}
                        onChange={(e) => onChangeRowIngredient(idx, e.target.value)}
                      >
                        {catalog.map((ing) => (
                          <MenuItem key={ing._id} value={ing.name}>{ing.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <TextField type="number" inputProps={{ step: '0.01' }} label="Qty" value={row.qty} onChange={(e) => onChangeRowQty(idx, e.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <TextField label="Unit" value={row.unit} disabled />
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <TextField label="Cost (A$)" value={row.cost} disabled />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button color="error" onClick={() => removeIngredient(idx)}>Remove</Button>
                    </Grid>
                  </Grid>
                ))}
                <Box>
                  <Button onClick={addIngredient}>Add Ingredient</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography>Ingredients Cost: {formatAUD(ingredientsCost)}</Typography>
        <Typography>Total Cost: {formatAUD(totalCost)}</Typography>
        <Typography>Margin: {margin.toFixed(2)}%</Typography>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={save} disabled={saving || !name}>{isEdit ? 'Save Changes' : 'Create Recipe'}</Button>
        <Button variant="outlined" onClick={() => navigate('/recipes')}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default RecipeForm;
