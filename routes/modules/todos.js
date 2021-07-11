const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')


router.get('/new', (req, res) => {
    return res.render('new')
})

// 新增
router.post('/', (req, res) => {
    //從req.body 拿出表單裡的name資料
    const name = req.body.name
    //存入資料庫
    return Todo.create({ name })
        //  完成新增後導回首頁
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render('detail', { todo }))
        .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render('edit', { todo }))
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .then(todo => todo.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router