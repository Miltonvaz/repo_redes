const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { userRoutes } = require('./src/routes/user');
const { verifyToken } = require('./src/middleware/auth');

dotenv.config(); 
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
 
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
