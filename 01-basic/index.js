require('dotenv').config();
const express = require('express');

const app = express();


app.get('/',(req,res)=>{
    res.json({
        "hi":'hello'
    })
})

app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 3000');
})

console.log('Hi hllo');