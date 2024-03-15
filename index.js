const express = require('express');
const bcrypt = require('bcrypt')

const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const { User, Item, Order } = require('./models')

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


// Getting Started
app.post('/api/v2/register', async (req, res) => {

    const users = new User;
    users.nickname = req.body.nickname;
    users.email = req.body.email;
    users.password = bcrypt.hashSync(req.body.password, 10);
    users.phone_number = req.body.phone_number;


    console.log("CHECKED => ", users)
    await users.save();

    return res.json({
        success: 1,
        message: "USER_CREATED",
        data: {
            "email": users.email,
            "password": users.password
        }
    })
});

app.post('/api/v2/login', async (req, res) => {
    const users = new User;
    users.email = req.body.email;
    users.password = req.body.password

    const userIndex = await User.findOne({ where: { email: users.email } });
    // console.log("INI_USERINDEX =>", userIndex)
    if (userIndex) {
        // const isValidPassword = users.filter((i) => i.password == bcrypt.compareSync(password,i.password))
        const isValidPassword = bcrypt.compareSync(users.password, userIndex.password);
        console.log("VALID", isValidPassword)
        console.log("VALID", users.password)
        console.log("VALID", userIndex.password)
        if (!isValidPassword) {
            // console.log("CONSOLE_OUTPUT => PASSWORD_LOGIN_FAILED")
            return res.send("PASSWORD_LOGIN_FAILED")
        }
        // console.log("CONSOLE_OUTPUT => LOGIN_SUCCESS")
        return res.send("LOGIN_SUCCESS")
    }
    return res.send("Wrong credentials, Invalid email or password")
});

// Items
app.post('/api/v2/item', async (req, res) => {

    const items = new Item;
    items.product_name = req.body.product_name;
    items.price = req.body.price;


    console.log("CHECKED => ", items)
    await items.save();

    return res.json({
        success: 1,
        message: "ITEM_CREATED",
        data: {
            "product_name": items.product_name,
            "price": items.price
        }
    })
});

app.get('/api/v2/items', async (req, res) => {
    const items = await Item.findAll();

    return res.json({
        success: 1,
        length: items.length,
        data: items
    })
});

// Orders
app.post('/api/v2/orders', async (req, res) => {

    const orders = new Order;
    orders.address_to = req.body.address_to;
    orders.quantity = req.body.quantity;
    orders.status = 'pending'


    console.log("CHECKED => ", orders)
    await orders.save();

    return res.json({
        success: 1,
        message: "ORDER_CREATED",
        data: {
            "id": orders.id,
            "address_to": orders.address_to,
            "quantity": orders.quantity,
            "status": orders.status
        }
    })
});
app.put('/api/v2/orders/:id', async (req, res) => {

    const orderId = req.params.id

    const orders = Order;
    orders.status = 'completed'

    // console.log("ORDER_ID",req)
    const orderIndex = await Order.findOne({ where: { id: orderId } })
    console.log("INI ORDER INDEX", orderIndex)
    if (!orderIndex) {

        // await orders.save();
        return res.send("ORDER_NOT_FOUND")
    }
    await orders.update({ status: orders.status }, {
        where: {
            id: orderId
        }
    });
    return res.send("ORDER_UPDATED")
});


// Morgan Log
app.use(morgan('combined', {
    stream: accessLogStream,
    skip: function (req, res) {
        return res.statusCode < 400
    }
}))

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})