const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const axios = require("axios").default

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Xem thời tiết")
        .addStringOption((option) => option.setName("keyword").setDescription("Nhập địa điểm").setRequired(true)),
    run: async ({ client, interaction }) => {
        const city = interaction.options.getString("keyword")
        let embed = new EmbedBuilder()

        axios.get(`https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    units: 'metric',
                    appid: process.env.WEATHER_API_KEY
                },
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                console.log(res.data)
                let image = ''
                switch (res.data.weather[0].main) {
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

                const name = `${res.data.name}`
                const temperature = `${parseInt(res.data.main.temp)} °C`
                const humidity = `${res.data.main.humidity}%`
                const description = res.data.weather[0].description.replace(/\w\S*/g, txt => {
                    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
                })
                const wind = `${parseInt(res.data.wind.speed)}Km/h`

                embed.setColor("DarkOrange")
                    .setDescription(`**${name}: ${temperature}**\n
                **${description}**\n`)
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: interaction.user.tag
                    })
                    .addFields([
                        {
                            name: `Humidity`,
                            value: `${humidity}`,
                            inline: true
                        },
                        {
                            name: `Wind Speed`,
                            value: `${wind}`,
                            inline: true
                        }
                    ])
                    .setThumbnail(image)
                    .setImage(client.user.displayAvatarURL())
                    .setTimestamp(Date.now())
                interaction.editReply({ embeds: [embed] })
            })
            .catch(err => console.log(err))

    }
}