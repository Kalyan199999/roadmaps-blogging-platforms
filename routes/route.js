const expres = require('express')

const {
    createPost,
    getBlogs,
    getBlogById,
    deleteBlog
} = require('../controllers/controller')

const route = expres.Router();

route.post( '/' , createPost )

route.get( '/' ,  getBlogs)

route.get('/:id',getBlogById)

route.delete('/:id' , deleteBlog)

module.exports = route