import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import restaurantRoutes from './modules/restaurant/restaurantRoutes.js';
import paymentRoutes from './modules/payment/paymentRoutes.js';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import tableRoutes from './routes/table.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json());

// Serving static files 
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    data: { status: 'ok' },
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', paymentRoutes);

// Error handling middleware 
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
