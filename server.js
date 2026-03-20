const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/dbConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');

dotenv.config();

const app = express();

//DB Bağlantısı
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Use the routes / Rotaları kullan
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

app.get('/', (req,res) => {
  res.send('API is running... / API çalışıyor...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
