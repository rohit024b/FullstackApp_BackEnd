const mongoose = require('mongoose')
const ROLES = require('../../constants/roles')

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: [ROLES.ADMIN, ROLES.AUTHOR, ROLES.READER], default: ROLES.READER }
},
    {
        timestamps: true, versionKey: false
    }
)

module.exports = mongoose.model("user", userSchema);