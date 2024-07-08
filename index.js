

const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});



if (process.env.NODE_ENV === 'production') {
  app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
}
// app.listen(port, () => {
//   console.log(`Server is running on PORT ${port}`);
// });
