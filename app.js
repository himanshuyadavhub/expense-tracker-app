const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./utils/db-connection');
const {Users,Expenses} = require('./models/associations');


const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");



app.use(cors());
app.use(express.json());

app.use("/user",userRoutes);
app.use("/expense",expenseRoutes);
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