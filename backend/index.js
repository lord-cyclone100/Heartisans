import express from 'express'
import cors from 'cors'
import { connectDB } from './database/db.js';
import { userModel } from './models/userModel.js';

const app = express();
const port = 5000;

const corsOptions = {
    origin:"http://localhost:5173",
    methods:["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials:true
}

app.use(cors(corsOptions));
app.use(express.json())

app.get('/',(req,res)=>{
  res.status(200).send("Hello World");
})

app.post('/api/user', async (req, res) => {
  try {
    const { userName, email } = req.body;
    // Save user only if not exists
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({ userName, email });
    }
    res.status(201).json({ message: "User saved", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

connectDB().then(()=>{
  app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  })
})