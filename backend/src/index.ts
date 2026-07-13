import express from 'express';
import { config } from './config/config.js'
import { connectDB } from './config/db.js';
import schemaRoutes from './services/schemas/schema.routes.js';
import instanceRoutes from './services/instances/instance.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
const app = express();

app.use(express.json());
app.use('/api/schemas', schemaRoutes);
app.use('/api/instances', instanceRoutes);
app.use(errorMiddleware);
async function startServer() {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
