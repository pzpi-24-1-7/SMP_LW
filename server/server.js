require('dotenv').config(); // Инициализируем .env в самом начале
const express = require('express');
const cors = require('cors');
const lotRoutes = require('./routes/lotRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.use('/api/lots', lotRoutes);

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});