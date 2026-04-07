const express = require('express')
const cors = require('cors');
require('dotenv').config()

const route = require('./routes/route')

const app = express();

app.use( cors() )
app.use( express.json() )

app.use( '/api/blog/' , route )

app.listen( process.env.PORT , async ()=>
{
    try 
    {
        console.log(`Server is running on the port ${process.env.PORT}`);
        
    } 
    catch (error) 
    {
        console.error( error)
    }
})