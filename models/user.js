// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   }
// });

// // Attach passport-local-mongoose plugin
// // Configure it to use email as the username field
// userSchema.plugin(passportLocalMongoose, {
//   usernameField: 'email'
// });

// module.exports = mongoose.model('User', userSchema);