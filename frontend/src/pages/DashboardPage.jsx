import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { formatAUD } from '../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from 'recharts';

const StatCard = ({ title, value }) => (
  <Card>
    <CardContent>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalRecipes: 0, avgMargin: 0, totalIngredients: 0, totalCost: 0 });
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, recipesRes] = await Promise.all([api.get('/dashboard'), api.get('/recipes')]);
        const recs = recipesRes.data || [];
        const sum = recs.reduce((s, r) => s + (r.totalCost || 0), 0);
        setSummary({ ...dashRes.data, totalCost: sum });
        setRecipes(recs);
      } catch (err) {
        toast.error('Failed to load dashboard');
      }
    };
    load();
  }, []);

  const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

  const marginData = useMemo(
    () => recipes.map((r) => ({ id: r._id, name: r.name, margin: r.margin ?? 0 })),
    [recipes]
  );
  const costData = useMemo(
    () => recipes.map((r) => ({ id: r._id, name: r.name, cost: r.totalCost ?? 0 })),
    [recipes]
  );
  const trendData = useMemo(
    () =>
      recipes
        .map((r) => ({ date: new Date(r.createdAt).toISOString().slice(0, 10), totalCost: r.totalCost || 0, sellingPrice: r.sellingPrice || 0 }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [recipes]
  );

  return (
    <Box p={1}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Recipes" value={summary.totalRecipes} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Average Margin (%)" value={(summary.avgMargin ?? 0).toFixed(2)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Ingredients" value={summary.totalIngredients} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Ingredient Cost" value={formatAUD(summary.totalCost)} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Margin by Recipe
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide={marginData.length > 8} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="margin" fill="#82ca9d" onClick={(d) => d?.activePayload && navigate(`/recipes/${d.activePayload[0].payload.id}`)} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Cost per Recipe
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={costData} dataKey="cost" nameKey="name" outerRadius={100} label>
                    {costData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} onClick={() => navigate(`/recipes/${entry.id}`)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatAUD(v)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {trendData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Total Cost vs Selling Price Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatAUD(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="totalCost" name="Total Cost" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="sellingPrice" name="Selling Price" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
