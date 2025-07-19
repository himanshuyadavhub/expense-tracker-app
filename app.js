const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");



app.use(cors());

app.use("/user",userRoutes);
app.get("/",(req,res)=>{
    res.send("Server is running perfectly fine.");
})

app.listen(5000,(err)=>{
    if(err){
        console.log("Server is not running", err.message);
        return;
    }
    console.log("Server is running on http://localhost:5000");
})