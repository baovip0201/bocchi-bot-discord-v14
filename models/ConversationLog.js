const {model, Schema}=require("mongoose")

let conversationLog=new Schema({
    guildId: String,
    userId: String,
    userTag: String,
    content: String,
})

module.exports=model("log", conversationLog)