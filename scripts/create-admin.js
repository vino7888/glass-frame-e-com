/**
 * Script to create an admin user
 * Run with: node scripts/create-admin.js
 * 
 * Make sure to set MONGODB_URI in your environment or update it below
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glass-frame-shop';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin name: ', async (name) => {
        rl.question('Enter admin password: ', async (password) => {
          try {
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              // Update to admin
              existingUser.role = 'admin';
              await existingUser.save();
              console.log('User updated to admin successfully!');
            } else {
              // Create new admin user
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);
              
              const admin = new User({
                email,
                name,
                password: hashedPassword,
                role: 'admin',
              });
              
              await admin.save();
              console.log('Admin user created successfully!');
            }
            
            await mongoose.disconnect();
            rl.close();
          } catch (error) {
            console.error('Error:', error);
            await mongoose.disconnect();
            rl.close();
          }
        });
      });
    });
  } catch (error) {
    console.error('Database connection error:', error);
    rl.close();
  }
}

createAdmin();
