import express from 'express';
import { config } from './config/config.js'
import { connectDB } from './config/db.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

try {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
