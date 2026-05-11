////////////////////////////////////////////////
/* Start : import from library of react  */
///////////////////////////////////////////////
/*
/
/
*/
////////////////////////////////////////////////
/* Start : import from src in my project */
///////////////////////////////////////////////
/*
/
/
*/
////////////////////////////////////////////////
/* Start : variable */
///////////////////////////////////////////////
/*
/
/
*/

////////////////////////////////////////////////
/* Start : variable+method */
///////////////////////////////////////////////
{/* เรียกเครื่องมือมาใส่ในตัวตัวแปร เพื่อเรียกใช้งานได้ง่าย */}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

////////////////////////////////////////////////
/* Start : variable+method+fn */
///////////////////////////////////////////////
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Database connection error:', err));


  // Schema ตามภาพที่ 1
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', userSchema);


// --- Routes (Controllers) ตามภาพที่ 2 ---

// POST /auth/signup
app.post('/auth/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "Registered!" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ token: 'mock-jwt-123', user });
  else res.status(401).json({ message: "Login Failed" });
});

// GET /users (List all)
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log('🚀 Backend on port 5000'));