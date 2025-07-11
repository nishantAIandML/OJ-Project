const express=require('express');
const app=express();
const DBConnection=require('./database/db');
const user=require('./models/User');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');

DBConnection(); // Connect to MongoDB

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({extended:true})); // Middleware to parse URL-encoded bodies

app.get('/',(req,res)=>{
    res.send('Welcome to the Online Judge API');
}); 
/*app.get('/register',async(req,res)=>{
    res.send('Register Page');
});*/
app.post('/register',async(req,res)=>{
    const {username, password} = req.body;
    if(!(username && password)){
        return res.status(400).send('Username and password are required');
    }
    // Check if user already exists
    const existingUser= await user.findOne({username});
    if(existingUser){
        return res.status(400).send('User already exists');
    }
    const hashPassword=await bcrypt.hash(password,10)
    const newUser=await user.create({
        username,
        password: hashPassword
    });
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'2h'
    });
    user.token=token;
    user.password=undefined; // Remove password from response
    res.status(201).json({message:"you are registered successfully",newUser});
});
app.listen(5000,()=>{
    console.log('Server is running on port 5000');  
});
