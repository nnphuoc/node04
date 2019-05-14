import mongoose from 'mongoose';

module.exports = {
    connectDB: ()=> {
        return mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
    },
    mongoose
}