import mongoose from 'mongoose';
import User from './models/User.js';

async function test() {
  await mongoose.connect('mongodb+srv://shoesshop:taidev@cluster0.q92fqaf.mongodb.net/dev?appName=Cluster0');
  
  // Create user
  const pwd = 'password123';
  const email = `test${Date.now()}@test.com`;
  
  const user = await User.create({
    name: 'Test',
    email: email,
    password: pwd
  });
  
  console.log('User created:', user.email);
  
  // Try to find and login
  const foundUser = await User.findOne({ email }).select('+password');
  
  const isMatch = await foundUser.comparePassword(pwd);
  console.log('Password match:', isMatch);
  
  await mongoose.disconnect();
}

test().catch(console.error);
