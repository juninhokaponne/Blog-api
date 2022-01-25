
const express = require('express');
const routes = require('./routes');
const port = 3333;
const app = express();



app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})