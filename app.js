const express = require('express');
const app = express();
const config = require("./config");
const PORT= config.port;
const HOST = "3.108.126.137";
const cors = require('cors');
const path = require('path');
const morgan = require("morgan");
const fs = require('fs');

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags : "a"});

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const featuresRoutes = require("./routes/premiumFeaturesRoutes");

const {sequelize} = require('./models');

app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/user/login");
})

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium", membershipRoutes);
app.use("/feature", featuresRoutes);

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
    console.log(`Server is running on http://${HOST}:${PORT}`);
})