const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'admin' 
  }
}, { timestamps: true});

userSchema.pre('save', async function () { 
    if (!this.isModified('password')) return;
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
         throw error;
}
});
module.exports = mongoose.model('User', userSchema);
