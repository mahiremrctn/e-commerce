require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { logger } = require('./middleware/logEvents.js');
const { errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const iyzicoPaymentRoutes = require('./routes/iyzicoPaymentRoutes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
const connectDB = require('./config/dbConfig');
const rateLimit = require('express-rate-limit');

//DB Bağlantısı
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,                  // 15 dakikada max 100 istek
  message: { success: false, message: 'Çok fazla istek gönderildi, lütfen bekleyin.' }
});

app.use(cors());
//Swagger docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//Request log middleware
app.use(logger);

app.use(express.json());

// Content-Type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Use the routes / Rotaları kullan
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', limiter);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/iyzico-payments', iyzicoPaymentRoutes);

io.on('connection', (socket) => {
  socket.on('chat message', (rawMessage) => {
    const message = typeof rawMessage === 'string' ? rawMessage.trim() : '';

    if (!message) {
      return;
    }

    io.emit('chat message', {
      socketId: socket.id,
      message,
      createdAt: new Date().toISOString(),
    });
  });
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

// Request error log middleware
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
