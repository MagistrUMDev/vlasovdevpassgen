const path = require("path");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const favicon = require('express-favicon');
 
 

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(favicon(__dirname + './favicon.png'))

const userRouter = require("./routes/userRoutes");
const passwordRouter = require("./routes/savedPasswordRoutes");

app.use(userRouter);
app.use(passwordRouter);

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
    } else {
      app.get('/', (req, res) => {
        res.send('Please set to production')
      })
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
