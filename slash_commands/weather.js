const{SlashCommandBuilder, EmbedBuilder}=require("discord.js")

module.exports={
    data: new SlashCommandBuilder()
            .setName("weather")
            .setDescription("Xem thời tiết")
            .addStringOption((option)=> option.setName("keyword").setDescription("Nhập địa điểm").setRequired(true)),
    run: async ({client, interaction})=>{
        const city= interaction.options.getString("keyword")
        if (city === "") return;
        let embed=new EmbedBuilder()
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`)
        .then(response=>response.json())
        .then(json=>{
            if(json.cod==='404') return interaction.editReply("Không có phản hồi")

            let image=''
            switch (json.weather[0].main) {
                case 'Clear':
                    image = 'https://cdn-icons-png.flaticon.com/512/4814/4814268.png';
                    break;

                case 'Rain':
                    image = 'https://cdn-icons-png.flaticon.com/512/1163/1163657.png';
                    break;

                case 'Snow':
                    image = 'https://cdn-icons-png.flaticon.com/512/2315/2315377.png';
                    break;

                case 'Clouds':
                    image = 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png';
                    break;

                case 'Haze':
                    image = 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png';
                    break;

                default:
                    image = '';
            }


            const temperature= `${parseInt(json.main.temp)} °C`;
            const humidity= `${json.main.humidity}%`;
            const description= `${json.weather[0].description}`;
            const wind= `${parseInt(json.wind.speed)}Km/h`;

            // const convertToArray=description.toLowerCase().split(' ');
            // const result = convertToArray.map(function (val) {

            //     return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
            
            // });

            embed.setColor("DarkOrange")
                .setDescription(`**${temperature}**\n
                **${description}**\n\n
                Humidity: ${humidity}\n
                Wind Speed: ${wind}`)
                .setThumbnail(image)
            interaction.editReply({embeds: [embed]})
        })
    }
}