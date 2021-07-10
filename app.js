
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')
const app = express()
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    Todo.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(todos => res.render('index', { todos }))
        .catch(error => console.error(error))
})

app.get('/todos/new', (req, res) => {
    return res.render('new')
})

// 新增
app.post('/todos', (req, res) => {
    //從req.body 拿出表單裡的name資料
    const name = req.body.name
    //存入資料庫
    return Todo.create({ name })
        //  完成新增後導回首頁
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render('detail', { todo }))
        .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render('edit', { todo }))
        .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    const { name, isDone } = req.body
    // const name = req.body.name
    // const isDone = req.body.isDone === 'on'
    return Todo.findById(id)
        .then(todo => {
            todo.name = name
            todo.isDone = isDone === 'on'
            return todo.save()
        })
        .then(() => res.redirect(`/todos/${id}`))
        .catch(error => console.log(error))
})
app.post('/todos/:id/delete', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .then(todo => todo.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})
app.listen(3000, () => {
    console.log('this server is running on http"//localhost:3000')
})