const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                require: true
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});


//Hashing the user password before saving into database
userSchema.pre('save', async function (next) {
    console.log("hello from this side");
    if (this.isModified('password')) {  // isModified is written if user change his pssword in future then changed password will also be hashed
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//We are generating token 
userSchema.methods.generateAuthToken = async function () {
    try {
        let tokengenerate = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: tokengenerate });
        await this.save();
        return tokengenerate;
        // above 2 lines signifies that first generate the token and then after add the token to DB
    } catch (error) {
        console.log(error);
    }
}
//Storing the message in DB
userSchema.methods.addMessage = async function (name, email, phone, message) {
    try {
        this.messages = this.messages.concat({ name, email, phone, message });
        await this.save();
        return this.messages;

    } catch (error) {

    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;