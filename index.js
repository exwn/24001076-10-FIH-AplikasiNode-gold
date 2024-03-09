const express = require('express');

const { User, Item, Order } = require('./models')


const app = express();
const port = 3002;
app.use(express.json())


const bcrypt = require('bcrypt')
// const hash = bcrypt.hashSync("password",10)
// console.log("BCRYPT_HASH =>", hash)

// const validate = bcrypt.compareSync("password",hash) // true
// console.log(validate)

// const users = []
const users = [
    {
        id: 1,
        nickname: "Ida Kemmer",
        email: "Ida.Kemmer25@example.net",
        password: "$2b$10$T91sVutvgoDNihY0JY7RD.4aa16Dfj5CBSL/kw.Rw4ik.Eb7qmyxe",
        phone_number: "516-830-6789"
    }
]
const items = [
    {
        id: 1,
        product_name: "Tasty Fresh Ball",
        price: 150000
    }
]
const orders = [
    {
        id: 1,
        user_id: 1,
        item_id: 1,
        addressTo: "059 Gerhard Pines",
        quantity: 3
    }
]

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    // res.send('Hello World!');

    try {
        const getUser = await users;
        const response = {
            data: getUser.map(item => {
                return {
                    ...item
                }
            })
        }
        // res.send(users)
        res.status(200).json(response)
    } catch (err) {
        console.log('Error Getting Users', err);
        res.status(500).send('Internal Server Error')
    }

    // console.log(users)
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
    return res.status(201).send(user.email)

});
app.post('/api/v1/login', (req, res) => {
    // res.send('LOGIN_ROUTE');
    const { email, password } = req.body

    const userIndex = users.find((i) => i.email == email);
    // console.log("INI_USERINDEX =>", userIndex)
    if (userIndex) {
        // const isValidPassword = users.filter((i) => i.password == bcrypt.compareSync(password,i.password))
        const isValidPassword = bcrypt.compareSync(password, userIndex.password);
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
app.get('/api/v1/items', (req, res) => {
    // res.send('ITEMS_ROUTE');
    res.send(items)
});

// Orders
app.post('/api/v1/orders', (req, res) => {
    // res.send('ORDERS_ROUTE')
    const { user_id, item_id, addressTo, quantity } = req.body
    const order = {
        id: orders[orders.length - 1]?.id + 1 || 1,
        user_id,
        item_id,
        addressTo,
        quantity
    };
    orders.push(order)
    console.table(orders)

    return res.status(201).send(order)
});
app.put('/api/v1/orders/:id', (req, res) => {
    // res.send('ORDERS_ROUTE')
    const orderId = orders.findIndex(i => i.id == req.params.id)
    console.log("CONSOLE_OUTPUT => ", orderId)
    // console.log("CONSOLE_OUTPUT => ", x)
    const { user_id, item_id, addressTo, quantity } = req.body
    // const x = orders.findIndex(())
    const updateOrder = {
        user_id,
        item_id,
        addressTo,
        quantity
    }
    orders.push(updateOrder)
    console.table(orders)
    console.table(updateOrder)

    return res.send("SUCCESS")
});

console.log("Hello World!");


app.get('/testing/:nama/:alamat', (req, res) => {
    const nama = req.params.nama
    const alamat = req.params.alamat


    res.send(`Testng => nama saya ${nama}, alamat saya di ${alamat}`)
})

app.get('/testing', async (req, res) => {
    const users = await User.findAll();

    return res.json({
        success: 1,
        length: users.length,
        data: users
    })

});
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
    // console.log("CHECKED => ", orders)

    // return res.json({
    //     success: 1,
    //     message: "ORDER_CREATED",
    //     data: {
    //         "id": orders.id,
    //         "address_to": orders.address_to,
    //         "quantity": orders.quantity,
    //         "status": orders.status
    //     }
    // })

});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})