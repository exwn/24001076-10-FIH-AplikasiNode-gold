const express = require('express');
const app = express();
const port = 3002;


const bcrypt = require('bcrypt')
// const hash = bcrypt.hashSync("password",10)
// console.log("BCRYPT_HASH =>", hash)

// const validate = bcrypt.compareSync("password",hash) // true
// console.log(validate)

const users = []

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Getting Started
app.post('/api/v1/register', (req, res) => {
    // res.send('REGISTER_ROUTE');
    const { nickname, email, password, phone_number } = req.body;
    const user = {
        id: users[users.length - 1]?.id + 1 || 1,
        nickname,
        email,
        password: bcrypt.hashSync(password, 10),
        phone_number
    };
    users.push(user)
    console.table(users)
    // return res.sendStatus(201)
    return res.send(user.email)

});
app.post('/api/v1/login', (req, res) => {
    // res.send('LOGIN_ROUTE');
    const { email, password } = req.body

    const userIndex = users.find((i) => i.email == email);
    // console.log("INI_USERINDEX =>", userIndex)
    if (!userIndex) {
        // const isValidPassword = users.filter((i) => i.password == bcrypt.compareSync(password,i.password))
        const isValidPassword = bcrypt.compareSync(password, userIndex.password);
        if (!isValidPassword) {
            return res.sendStatus(400).send("NOT_FOUND")
        }
    }
    return res.sendStatus(200)
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