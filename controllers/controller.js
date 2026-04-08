const pool = require('../database/config')

// post a new blog
const createPost = async (req,res)=>
{
    try 
    {
        // get the required fields of the blog
        const { title,content,category,tags } = req.body;

        // if any one of these fields are empty then return
        if( !title || !content || !category )
        {
            return res.status(400).json({
                ok:false,
                message:"Fields can not be empty!"
            })
        }

        // insert a record query
        const query = `INSERT INTO personalblog(title,content,catogory,tags) VALUES( ?,?,?,? )`

        // explicity add the values
        const values = [   
            title,
            content,
            category,
            tags === undefined ? [] :tags
        ];

        // execute the query
        const [ rows , _ ] = await pool.execute( query , values );

        // return with status code 201 'created'
        return res.status(201).json({
            ok:true,
            message:"Blog is posted!",
            data:rows
        })
        
    } 
    catch (error) 
    {
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }
}

// Get all the available blogs
const getBlogs = async (req,res)=>
{
    try 
    {
        const page = Number( req.query.page )    || 1;
        const limit = Number(  req.query.limit ) || 2;

        const skip = (page-1)*limit;

        const query = `select id,title,content,catogory,tags,updatedAt from personalblog limit ${limit} offset ${skip}`;

        // query to fetch all the records
        const [ data  ] = await pool.execute(query );

        const [ rows  ] = await pool.execute( 'SELECT count(id) as count FROM personalblog')

        // return the data
        return res.status(200).json({
            ok:true,
            message:"Data Fetched successfully!",
            total:rows[0].count,
            currentPage: page,
            data:data,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            ok:false,
            message:error.message
        })
    }
}

// fetch the particular blog based on the id
const getBlogById = async (req,res)=>
{
    try 
    {
        // get the id of the blog
        const { id } = req.params;

        // query to find the blog using id
        const query = "SELECT title,content,catogory,tags,updatedAt FROM personalblog WHERE id = ?";

        // execute the query
        const [ rows , fields ] = await pool.execute( query , [id] );

        // if no records found then the return not available or blog not found
        if( rows.length === 0 )
        {
           return res.status(404).json({
            ok:false,
            data:[],
            message:"Blog is not found!"
           })
        }

        // return the found blog/data
        return res.status(200).json({
            ok:true,
            message:"Fetched successfully!",
            id:id,
            data:rows
        })
    } 
    catch (error) 
    {
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }
}


// delete the blog based on the id specified
const deleteBlog = async (req,res)=>
{
    try
    {
        // delete query to remove the specified blog
        const query = "DELETE FROM personalblog WHERE id=?";

        // get the blog id
        const {id} = req.params;

        // execute the query to delete
        // if blog is found then mysql will delete the record else it will not effect any reocrd 
        const [ result ] = await pool.execute( query , [id] );

        if( result.affectedRows === 0 )
        {
            return res.status(404).json({
                ok:false,
                data:[],
                message:"Blog not found!",
            })
        }
        
        // return the data
        return res.status(204).json({
            ok:true,
            data:result,
            message:"Blog is deleted successfully!"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            ok:false,
            message:err.message
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, tags } = req.body;

        // Use a proper
        const updatedAt = new Date(); 

        let fieldsToUpdate = [];
        let values = [];

        // We check for 'undefined' so that empty strings or nulls CAN be saved
        if (title !== undefined) 
        {
            fieldsToUpdate.push("title = ?");
            values.push(title);
        }
        if (content !== undefined) {
            fieldsToUpdate.push("content = ?");
            values.push(content);
        }
        if (category !== undefined) {
            fieldsToUpdate.push("catogory = ?"); 
            values.push(category);
        }
        if (tags !== undefined) {
            // This allows the user to send null or an empty string to clear tags
            fieldsToUpdate.push("tags = ?");
            values.push(tags);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ ok: false, message: "No fields provided for update" });
        }

        // Always update the timestamp if at least one field changed
        fieldsToUpdate.push("updatedAt = ?");
        values.push(updatedAt);

        // Append ID for the WHERE clause
        values.push(id);

        const query = `UPDATE personalblog SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Blog not found" });
        }

        return res.status(200).json({
            ok: true,
            message: "Updated successfully!",
            data: { id, updatedAt }
        });
    } 
    catch (error) 
    {
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};


const searchByCategory = async (req,res)=>
{
    try
    {
        const { item } = req.params;

        if( !item.trim() )
        {
            return res.status(404).json({
                ok:false,
                message:"Search item is Empty!",
                data:[]
            })
        }

        const query = `select id,title,content,catogory,tags from personalblog where catogory like ? `;

        const searchTerm = `%${item.trim().toLowerCase()}%`;

        const [ data  ] = await pool.execute(query,[searchTerm] );

        return res.status(200).json({
            ok:true,
            message:'Fetched successfully!',
            data:data
        })
    }
    catch(error)
    {
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }
}

module.exports = {
    createPost,
    getBlogs,
    getBlogById,
    deleteBlog,
    updateBlog,
    searchByCategory
}
