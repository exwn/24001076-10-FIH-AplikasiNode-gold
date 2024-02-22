const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Getting Started
app.post('/api/v1/register', (req, res) => {
    res.send('REGISTER_ROUTE');
});
app.post('/api/v1/login', (req, res) => {
    res.send('LOGIN_ROUTE');
});

// Items
app.get('/api/v1/items', (req, res) => {
    res.send('ITEMS_ROUTE');
});

// Orders
app.post('/api/v1/orders', (req, res) => {
    res.send('ORDERS_ROUTE')
});
app.put('/api/v1/orders/:id', (req, res) => {
    res.send('ORDERS_ROUTE')
});

console.log("Hello World!");




app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})