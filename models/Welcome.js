const {model, Schema}=require("mongoose")
 
let welcomeSchema=new Schema({
    Guild: String,
    Channel: String,
    Content: String,
    Role: String
})

module.exports = model("welcome", welcomeSchema)