const { MongoClient } = require("mongodb")

module.exports = {
    run: async (client, message) => {

        const uri = "mongodb://localhost:27017"
        const client_mongo = new MongoClient(uri)
        try {
            const database = client_mongo.db("bot-discord");
            const log = database.collection("log");
            console.log("Connected to Mongo")
            // create an array of documents to insert
            let conversationLog = 
                { role: "user", content: message.author.id }
            ;

            // let prevMessages = "message.channel.messages.fetch({ limit: 1 });"
            // prevMessages.reverse()

            // prevMessages.forEach(msg => {
            //     conversationLog.push({
            //         role: `${client.user.id}`,
            //         content: msg.content
            //     })
            // });
            //console.log(conversationLog)
            // this option prevents additional documents from being inserted if one fails
            const options = { ordered: true };
            const result = await log.insertOne(conversationLog);
            console.log(`${result.insertedCount} documents were inserted`);
        } finally {
            await client_mongo.close();
        }
    }
}