const express = require('express')
const fs = require('fs')
const path = require('path')
const { checkParams, checkBody } = require('./validation/validator');
const { userSchema, idSchema } = require('./validation/schema');

const app = express()

try {
    fs.readFileSync(path.join(__dirname, '/usersData.json'), 'utf-8')
} catch (error) {
    const users = []
    fs.writeFileSync(path.join(__dirname, '/usersData.json'), JSON.stringify(users, null, 4))
}

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '/usersData.json'), 'utf-8'))

if (users.length < 1) {
    uniqueID = 0
} else {
    uniqueID = users[users.length - 1].id
}

app.use(express.json())

// Get all users
app.get('/users', (req, res) => {
    res.send({ users })
})

// Get user by id
app.get('/users/:id', checkParams(idSchema), (req, res) => {
    const user = users
        .find((user) => user.id === Number(req.params.id))
    
    if (user) {
        res.send({ user })
    } else {
        res.status(404).send({ user: null })
    }
})

// Create user
app.post('/users', checkBody(userSchema), (req, res) => {
    uniqueID += 1

    users.push({
        id: uniqueID,
        ...req.body
    })

    res.send({ id: uniqueID })

    fs.writeFileSync(path.join(__dirname, '/usersData.json'), JSON.stringify(users, null, 4))
})

// Update user by id
app.put('/users/:id', checkParams(idSchema), checkBody(userSchema), (req, res) => {
    const user = users
        .find((user) => user.id === Number(req.params.id))

    if (user) {
        const { surname, name, patronymic, age, city } = req.body
        user.surname = surname
        user.name = name
        user.patronymic = patronymic
        user.age = age
        user.city = city
        res.send({ user })

        fs.writeFileSync(path.join(__dirname, '/usersData.json'), JSON.stringify(users, null, 4))
    } else {
        res.status(404).send({ user: null })
    }
})

// Delete user by id
app.delete('/users/:id', checkParams(idSchema), (req, res) => {
    const user = users
        .find((user) => user.id === Number(req.params.id))

    if (user) {
        const userIndex = users.indexOf(user)
        users.splice(userIndex, 1)
        res.send({ user })

        fs.writeFileSync(path.join(__dirname, '/usersData.json'), JSON.stringify(users, null, 4))
    } else {
        res.status(404).send({ user: null })
    }
})

app.use((req, res) => {
    res.status(404).send({
        message: 'URL not found!'
    })
})

app.listen(3000)