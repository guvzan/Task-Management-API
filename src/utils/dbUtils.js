import mongoose from "mongoose";

const connectToDB = async (dbURI) => {
    try{
        await mongoose.connect(dbURI);
        console.log('Connected!');
    }catch (e){
        console.log(e);
    }
}

export {
    connectToDB
}