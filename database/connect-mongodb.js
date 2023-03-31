const mongoose =require("mongoose")

module.exports = {
    connectMongoDb: async ()=>{
        const uri= process.env.MONGODB
        await mongoose.connect(uri || '', {keepAlive: true})
        if(mongoose.connect){
            console.log("Connected to MongoDB")
        }
    }
}