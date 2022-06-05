// define logger
import { logger } from './common/logger';

// import constants
import { Constants } from './common/constants';
const constants = new Constants();

// import discord modules
import * as Discord from 'discord.js';
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// ready event
client.on('ready', () => {
  if (client.user != null) {
    client.user.setPresence(
      { activities: [{ name: constants.DISCORD_ACTIVITY_NAME }], status: 'online' }
    );
    logger.info(`logged on discord server.`);
  } else {
    logger.error(`client is not logined.`);
  }
})

// message is sended event
import { DiscordMessageController } from './controller/discord_message_controller';
client.on('messageCreate', (message: any) => {
  // call message recieve controller
  DiscordMessageController.recieve_controller(client, message);
});

// discord client login
client.login(process.env['DISCORD_BOT_TOKEN']);
