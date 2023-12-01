const express = require('express');
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
const { authRouter, newsAggregatorRouter } = require('./routes');
const { PORT_NUMBER } = require('./config/env.config');

const PORT = PORT_NUMBER || 3001;

app.use(bodyParser.json());
app.use(routes);

routes.get('/', (req, res) => {
  return res.status(200).send("News Aggregator Project");
});

routes.use('/auth', authRouter);

routes.use('/newsAggregator', newsAggregatorRouter);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server listening on PORT: ${PORT}`);
  } else {
    console.log(`Some Error Enconuntered to run the Server: ${err}`);
  }
});