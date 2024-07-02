import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    username: {
      type: String,
      required: [true, 'User name is required'],
      unique: true,
      validate: {
        validator: function (value) {
          return !/\s/.test(value);
        },
        message: (props) => `${props.value} conatins spaces, which is not allowed`,
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [emailRegex, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [6, 'password must be at least 6 characters long'],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// encrypt the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidate, user) {
  return await bcrypt.compare(candidate, user);
};

userSchema.set('toJSON', {
  transform: function (doc, docObj, options) {
    delete docObj.password;
    return docObj;
  },
});

export default mongoose.model('User', userSchema);
