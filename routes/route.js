const expres = require('express')

const {
    createPost,
    getBlogs,
    getBlogById,
    deleteBlog,
    updateBlog,
    searchByCategory
} = require('../controllers/controller')

const route = expres.Router();

route.post( '/' , createPost )

route.get( '/' ,  getBlogs)

route.get('/:id',getBlogById)

route.delete('/:id' , deleteBlog)

route.patch( '/:id' , updateBlog )

route.get( '/search-category/:item' , searchByCategory )

module.exports = route