const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: ['https://movie-corner-frontend-sage.vercel.app'],
  credentials: true
}));
app.use(bodyParser.json());

const userRoutes = require('./src/routes/userRoutes');
app.use("/auth", userRoutes);

async function main() {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    app.use("/", (req, res) => {
        res.json("Server is running!");
    })
}  

main().then(() => console.log("MongoDB Connected!")).catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

    
