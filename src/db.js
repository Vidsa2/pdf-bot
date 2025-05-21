import mongoose from "mongoose";   

async function connectDB() {
    if(mongoose.connection[0].readyState) {
        console.log("MongoDB is already connected");
        return;
    }   
    const MONGO_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.elu21.mongodb.net/pdf-bot?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (e){
        console.log("MongoDB connection error", e);
    }
}

async function disconnectDB() {
    if(mongoose.connection[0].readyState) {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    } else {
        console.log("MongoDB is already disconnected");
    }
}

export { connectDB, disconnectDB };