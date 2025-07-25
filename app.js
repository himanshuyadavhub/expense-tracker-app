const express = require('express');
const app = express();
const config = require("./config");
const PORT= config.port;
const cors = require('cors');
const sequelize = require('./utils/db-connection');
const { Users, Expenses } = require('./models/associations');
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const featuresRoutes = require("./routes/premiumFeaturesRoutes");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium", membershipRoutes);
app.use("/feature", featuresRoutes);
app.get("/", (req, res) => {
    res.json({message:"Respose after creating payment order"});
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not running", err.message);
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})