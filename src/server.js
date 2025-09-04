// Entry point: configure express app and mount routes
const express = require('express');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth.route');
const projectRoutes = require('./routes/project.route');
const userRoutes = require('./routes/user.route');
const { migrate } = require('./models/migrate');

const app = express();
app.use(cors());
app.use(express.json());

// Run migrations
migrate().then(()=> console.log('Migrations complete')).catch(e=>console.error('Migration error', e));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

const PORT = config.PORT || 4000;
app.listen(PORT, ()=> console.log(`CIF Backend running on ${PORT}`));
