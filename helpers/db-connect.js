
import mongoose from 'mongoose';

async function dbConnect() {
    mongoose.set('strictQuery', true);

    if (mongoose.connections[0].readyState) {
        console.log('Already connected to the database');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('<<< DB: Connected >>>');
    } catch (error) {
        console.error('<<<<DB: Connection error:>>>', error);
    }
}

export default dbConnect;