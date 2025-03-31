const express =require("express");

const cors = require("cors");
const { connection } = require("./db");
const { userAuthRouter } = require("./routes/authRoute");

const app = express()

app.use(cors());

require("dotenv").config()


app.use(express.json())
app.use("/auth",userAuthRouter)

const PORT=process.env.PORT
app.listen(PORT, async () => {
    try {
      await connection;
  
      console.log(`Connected to the database ${PORT}`);
    } catch (error) {
      console.error(error);
    }
  });