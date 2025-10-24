# Emilio's COGS System (v6)

Web system to manage restaurant Cost of Goods Sold (COGS): ingredients, recipes, total costs, selling prices, and margins. Built with Node.js (Express), MongoDB (Mongoose), and React (Vite + Material UI) using a dark theme.

This version adds editable ingredients inside the RecipeForm when editing recipes (v6). It builds on v5 full CRUD: edit recipes via a prefilled form and delete with confirmation, while keeping English UI, AUD currency, fixed units, authentication, routing, and the analytics dashboard with interactive charts.

—

## Table of Contents

1) What it includes & how it works
2) Stack & project structure
3) Run with Docker
4) Local development (no Docker)
5) Seed data & users (AUD)
6) How to use (UI walkthrough)
7) Dashboard insights (v4)
8) Full recipe CRUD (v5)
9) API (main endpoints)
10) Data models
11) Auth, roles & session
12) Environment variables
13) Useful scripts
14) Troubleshooting

—

## 1) What it includes & how it works

- Ingredients management: name, unit (fixed list: kg, g, L, ml, pcs), unit cost (AUD), supplier.
- Recipes management: name, category, yield, ingredient rows (qty), labour cost, selling price, total cost and margin.
- Dashboard: total recipes, average margin, total ingredients, and an aggregated total recipe cost (AUD formatted).
- JWT Auth with two roles:
  - admin: full access (CRUD for ingredients and recipes, create users).
  - user: read-only (dashboard and recipes).
- Auto-recalculation: total cost and margin update when ingredients, labour, or prices change.
- Professional UI: Material UI dark theme, AppBar + Drawer, responsive layout.

—

## 2) Stack & project structure

Tech: Express, Mongoose, JWT, React (Vite), Material UI, Axios, Docker.

```
emilios-cogs/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Ingredient.js
│   │   │   └── Recipe.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── ingredientController.js
│   │   │   ├── recipeController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── ingredientRoutes.js
│   │   │   ├── recipeRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── seed/seed.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── NavBar.jsx (legacy, not used in v3)
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── RecipesPage.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   └── IngredientsPage.jsx
│   │   ├── utils/formatCurrency.js
│   │   └── App.jsx
│   ├── index.html
│   ├── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml
```

—

## 3) Run with Docker

1) Create backend env file:

```
cp backend/.env.example backend/.env
```

2) Start the stack:

```
docker-compose up --build
```

3) Seed demo data (new terminal):

```
docker compose exec backend node src/seed/seed.js
```

4) Open the app at http://localhost:5173

Ports:
- Backend: 5000 (API at http://localhost:5000/api)
- Frontend: 5173
- MongoDB: inside container (mongo:6)

—

## 4) Local development (no Docker)

Requirements: Node.js 18+, MongoDB local.

- Backend
  - Env: copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`, `JWT_SECRET`.
  - Install & run:
    ```
    cd backend
    npm install
    npm run dev
    ```
  - Seed:
    ```
    npm run seed
    ```

- Frontend
  - Env: `VITE_API_URL` (default http://localhost:5000/api)
  - Install & run:
    ```
    cd frontend
    npm install
    npm run dev
    ```
  - Open: http://localhost:5173

—

## 5) Seed data & users (AUD)

The seed script creates:
- 1 admin:
  - Email: `m.garavito82@gmail.com`
  - Password: `123456`
- 1 read-only user:
  - Email: `user@emilios.com`
  - Password: `123456`
- Ingredients (AUD): Tomato (A$3.5/kg, Bidfood), Pasta (A$2.2/kg, Bidfood), Parmesan (A$12/kg, PFD).
- Recipe: Spaghetti Pomodoro using those ingredients.

Reseed:
```
docker compose exec backend node src/seed/seed.js
```
or locally:
```
cd backend && npm run seed
```

—

## 6) How to use (UI walkthrough)

1) Login screen: full viewport, centered form at `/login`. Sign in with the above credentials.
2) After login, the left Drawer and top AppBar appear:
   - Dashboard: summary cards (total recipes, average margin, total ingredients, total cost) and interactive charts (margin by recipe, cost breakdown, and cost vs price trend).
   - Recipes:
     - Admin: create via “New Recipe” (dedicated form) or quick-create dialog; edit and delete existing recipes.
       - The New Recipe form lets you pick catalog ingredients, enter quantities, auto-fills units, and auto-calculates line cost, total cost and margin.
     - User: list (read-only).
   - Ingredients:
     - Admin: create/edit with fixed unit dropdown (kg, g, L, ml, pcs) and A$ unit cost.
     - User: read-only list.
3) Branding (logo): place your logo file at `frontend/public/logo.png` (PNG or SVG). The AppBar and Drawer header automatically load `/logo.png`. Suggested height ~28–32px, transparent background.
4) Logout: button in AppBar/Drawer.

Notes:
- Line cost = `qty * unitCost` from the ingredient catalog (AUD).
- Margin shows as percentage with two decimals.
- Currency is displayed in AUD (A$) throughout.

—

## 7) Dashboard insights (v4)

The dashboard now includes interactive charts powered by Recharts:
- Margin by Recipe (Bar): compare recipe margins; click a bar to open the recipe detail.
- Cost per Recipe (Pie): visualize cost distribution; click a slice to open the recipe detail.
- Total Cost vs Selling Price (Line): trend over time using recipe `createdAt`.

All charts are responsive and follow the MUI dark theme for a consistent look.

�?"

## 8) Full recipe CRUD (v5)

Routes (private, under Layout):
- `/recipes` — list
- `/recipes/new` — create
- `/recipes/:id` — detail
- `/recipes/edit/:id` — edit (prefilled)

Detail view includes “Edit Recipe” and “Delete Recipe” (with confirmation). Edit uses the same RecipeForm with initial values loaded from the API and saves via `PUT /api/recipes/:id`.

v6: Editable ingredients in RecipeForm
- Add and remove ingredient rows dynamically while editing an existing recipe.
- Totals and margins recalculate automatically as you add/remove or change quantities.
- Saving will send the full updated ingredients array to the backend (PUT `/api/recipes/:id`).

—

## 9) API (main endpoints)

Base URL: `http://localhost:5000/api`

Auth:
- `POST /auth/login` (public): returns `{ token, role, name, email }`.
- `POST /auth/register` (admin only): create users.
- `GET /auth/me` (auth): current user.

Ingredients:
- `GET /ingredients` (auth): list.
- `POST /ingredients` (admin): create.
- `PUT /ingredients/:id` (admin): update.
- `DELETE /ingredients/:id` (admin): delete.

Recipes:
- `GET /recipes` (auth): list.
- `GET /recipes/:id` (auth): detail.
- `POST /recipes` (admin): create (server recalculates on save).
- `PUT /recipes/:id` (admin): update (recalculates).
- `DELETE /recipes/:id` (admin): delete.

Dashboard:
- `GET /dashboard` (auth): `{ totalRecipes, avgMargin, totalIngredients }`.

Login via cURL:
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"m.garavito82@gmail.com","password":"123456"}'
```
Use the token as `Authorization: Bearer <token>` for subsequent calls.

—

## 10) Data models (summary)

User
```
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin','user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}
```

Ingredient
```
{
  name: String,
  unit: String,
  unitCost: Number, // AUD
  supplier: String,
  lastUpdated: Date
}
```

Recipe
```
{
  name: String,
  category: String,
  yield: Number,
  ingredients: [{ name: String, qty: Number, unit: String, cost: Number }],
  laborCost: Number, // AUD
  totalCost: Number, // AUD
  sellingPrice: Number, // AUD
  margin: Number,
  createdAt: Date
}
```

—

## 11) Auth, roles & session

- JWT: login issues a token `{ id, role }` valid for 7 days.
- Auth middleware: verifies token, attaches `req.user`.
- Role middleware: restricts by `admin` or `user`.
- Frontend stores token and role in `localStorage`; Axios adds `Authorization: Bearer <token>`.

—

## 12) Environment variables

Backend (`backend/.env`):
```
MONGO_URI=mongodb://mongo:27017/emilios
JWT_SECRET=supersecretkey
PORT=5000
```

Frontend:
```
VITE_API_URL=http://localhost:5000/api
```

—

## 13) Useful scripts

- Backend
  - `npm run dev`: development server (nodemon)
  - `npm start`: production server
  - `npm run seed`: run `src/seed/seed.js`

- Frontend
  - `npm run dev`: Vite dev server
  - `npm run build`: production build
  - `npm run preview`: preview the build

—

## 14) Troubleshooting

- MongoDB not connecting:
  - Check `MONGO_URI` in `backend/.env`. With Docker Compose use host `mongo`.
  - Ensure the `mongo` container is running: `docker ps`.

- Invalid login credentials:
  - Run the seed script.
  - Default admin: `m.garavito82@gmail.com` / `123456`.

- Costs not updating in recipes:
  - Edit/save the recipe; server recalculates total cost and margin.

- Ports in use:
  - Change port mappings in `docker-compose.yml` or free the ports.

- CORS/API URL issues:
  - If the frontend runs outside Docker, set `VITE_API_URL` accordingly.
