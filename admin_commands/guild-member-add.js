const {EmbedBuilder}=require("@discordjs/builders")
const Schema=require("../models/welcome")
module.exports={
    addMember: async (member)=>{
        Schema.findOne({Guild: member.guild.id})
        .then(async (data)=>{
            if(!data) return

            const welcomeChannel=member.guild.channels.cache.get(data.Channel)
            let embed= new EmbedBuilder()

            embed.setColor("DarkOrange")
            .setTitle("**Thành viên mới**")
            .setDescription(data.Content)
            .addFields({name: "Tống số thành viên", value: `${guild.memberCount}`})
            .setTimestamp(Date.now())

            welcomeChannel.send({embeds: [embed]})
            member.roles.add(data.Role)
        })
    }
}