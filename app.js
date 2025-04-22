const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api', schoolRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
