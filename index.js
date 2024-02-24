require('dotenv').config();
const { default: axios } = require('axios');
const { Client, GatewayIntentBits,EmbedBuilder,SlashCommandBuilder } = require('discord.js');
const { apitoken } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ]
});


  const weatherCommand= new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Please enter the name of the country, and I will provide you with the weather forecast.')
        .addStringOption(option=>
          option
          .setName("city")
          .setDescription("city name")
        );



client.on('ready', () => { 
 
    client.application.commands.create(weatherCommand)
    .then(console.log)
    .catch(console.error);
    console.log("Server is up!!!")
});
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'weather') { 
       const name = interaction.options.getString('city');
      let city_Name = name.toUpperCase()
      if (!name) {
        return interaction.reply('Please provide a city name!');
      }
       axios.get(`http://api.weatherapi.com/v1/current.json?key=${apitoken}&q=${name}&aqi=no
      `)
      .then(response => {
                let currentTemp = Math.ceil(response.data.current.temp_c)
                let humidity = response.data.current.humidity;
                let wind = response.data.current.wind_mph;
                let icon = response.data.current.condition.icon
                
                let country = response.data.location.country.toUpperCase()
                let pressure = response.data.current.pressure_in;
                let  text= response.data.current.condition.text;
                let local_time=response.data.location.localtime

                const exampleEmbed = new EmbedBuilder()
                .setColor('#170624')
                .setTitle(`The current temperature is ${currentTemp} °C in ${city_Name}, ${country}`)
                .addFields({name:`Local time`,value:`${local_time}`},
                {name: `Cloudiness:`, value: `${text}`},
                {name: 'Humidity:', value: `${humidity} ` },
                {name: `Wind Speed:`,  value: `${wind} m/s`  },
                {name: `Pressure:`,  value: `${pressure} hpa`},)
                .setThumbnail(`https:${icon}`)
                .setFooter({ text: 'Developed by Yara Megawer', iconURL: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXaEZriXgCxdvZEWkiXoVU3zww9tLopzklgw&usqp=CAU` });
                interaction.channel.send({ embeds: [exampleEmbed] });
        
        console.log(response.data); 
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        interaction.reply('An error occurred while fetching weather data.');
      });
    
    await interaction.reply(`Showing results for: ${city_Name}`);
    
  }
});

client.login(process.env.CLIENT_TOKEN);
