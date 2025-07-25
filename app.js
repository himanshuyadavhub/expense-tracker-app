const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./utils/db-connection');
const { Users, Expenses } = require('./models/associations');
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium", premiumRoutes)
app.get("/", (req, res) => {
    res.json({message:"Respose after creating payment order"});
})

app.listen(5000, (err) => {
    if (err) {
        console.log("Server is not running", err.message);
        return;
    }
    console.log("Server is running on http://localhost:5000");
})