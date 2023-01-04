require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const stripeControllers = require('./controllers/stripeControllers');
// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandleMiddleware = require('./middleware/error-handle');

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send(`<h1>Stripe Payment</h1>`)
})

app.post('/stripe', stripeControllers);
app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

const port = process.env.PORT || 3000;

const start = async () => { 
  try {
    app.listen(port, () => {
      console.log(`Server Listening on ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();