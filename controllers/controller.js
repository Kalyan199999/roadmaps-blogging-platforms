const pool = require('../database/config')

const createPost = async (req,res)=>
{
    try 
    {
        const { title,content,category,tags } = req.body;

        if( !title || !content || !category )
        {
            return res.status(400).json({
                ok:false,
                message:"Fields can not be empty!"
            })
        }

        const query = `INSERT INTO personalblog(title,content,catogory,tags) VALUES( ?,?,?,? )`

        const values = [   
            title,
            content,
            category,
            tags === undefined ? [] :tags
        ];

        const [ rows , _ ] = await pool.execute( query , values );

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

const getBlogs = async (req,res)=>
{
    try 
    {
        const [ data , fields ] = await pool.execute('SELECT * FROM personalblog');

        return res.status(200).json({
            ok:true,
            data:data,
            message:"Data Fetched successfully!"
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

const getBlogById = async (req,res)=>
{
    try 
    {
        const { id } = req.params;

        const query = "SELECT title,content,catogory,tags FROM personalblog WHERE id = ?";

        const [ rows , fields ] = await pool.execute( query,[id] );

        if( rows.length === 0 )
        {
           return res.status(404).json({
            ok:false,
            data:[],
            message:"Blog is not found!"
           })
        }

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


const deleteBlog = async (req,res)=>
{
    try
    {
        const query = "DELETE FROM personalblog WHERE id=?";
        const {id} = req.params;

        const [ rows , fields ] = await pool.execute( query , [id] );

        if( rows.length === 0 )
        {
            return res.status(404).json({
                ok:false,
                data:[],
                message:"Blog not found!",
            })
        }
        
        return res.status(204).json({
            ok:true,
            data:rows,
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


module.exports = {
    createPost,
    getBlogs,
    getBlogById,
    deleteBlog
}