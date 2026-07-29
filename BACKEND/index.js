import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()
const port = process.env.port || 3000 

app.get('/:name' , (req,res) => {
    res.send(`welcome ${req.params.name}`) ;
})

app.listen(port, ()=>{
    console.log(`this server is running at port ${port}`) ;

})