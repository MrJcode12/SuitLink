import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required!'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email required!'],
    trim: true, 
    lowercase: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password required!'],
    select: false,
  },
  role: {
    type: String,
    enum: ['applicant', 'employer', 'admin'],
    default: 'applicant',
  },
  accStatus: {  
    type: String,
    enum: ['active', 'suspended', 'banned', 'deactivated'],
    default: 'active',
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
  },
  emailVerificationAttempts: {
    type: Number,
    default: 0,
  },
  forgotPasswordCode: {
    type: String,
    select: false,
  },
  forgotPasswordExpires: {
    type: Date,
  },
  forgotPasswordAttempts: {
    type: Number,
    default: 0,
  },
  emailVerifiedAt: {
    type: Date,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

// Password Hashing
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(13);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
})

//Password Comparison
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};


const User = mongoose.model('User', userSchema);

export default User;