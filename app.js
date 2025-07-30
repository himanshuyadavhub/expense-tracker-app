const express = require('express');
const app = express();
const config = require("./config");
const PORT= config.port;
const cors = require('cors');
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const featuresRoutes = require("./routes/premiumFeaturesRoutes");

const {sequelize} = require('./models');

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
sequelize.sync({alter:true}).then(res => {
    console.log("Table synced")
}).catch(err => {
    console.log("Table not synced", err.message);
})
app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not running", err.message);
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})