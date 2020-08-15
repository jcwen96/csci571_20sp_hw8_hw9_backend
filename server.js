const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router') 
const port = process.env.PORT || 8080;

app.use(cors());

router.route(app);

app.use((err, req, res, next) => {
  if (err != null) {
    console.error(`ERROR: ${err.stack}`);
    res.status(500).send(`Sorry, something inside the server broke.`);  
  }
});

app.listen(port, () => console.log(`INFO: Homework8/9后端应用，侦听端口${port}`));