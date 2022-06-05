// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// create message modules
import { DiscordMessageAnalyzer } from './../logic/discord_message_analyzer';

// import logic
import { AwsManager } from './../logic/aws_manager';

export class DiscordMessageController {
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recieve_controller(client: any, message: any) {
        if (message.mentions.users.has(client.user.id)) {
            logger.info(`recieved message : ${message.content}`);
            logger.trace(message);

            // analyze message
            const analyzer = new DiscordMessageAnalyzer();
            analyzer.analyze(message.content, message.guild.id, message.author.id, client.user.id)
                .then(() => {
                    logger.trace(analyzer);

                    // call function by type
                    switch (analyzer.type) {
                        case constants.TYPE_START_SERVER:
                            // start server
                            DiscordMessageController.start_server(client, message, analyzer);
                            break;
                        case constants.TYPE_GET_PUBLIC_IP:
                            // get public ip
                            DiscordMessageController.get_public_ip(client, message, analyzer);
                            break;
                        case constants.TYPE_STOP_SERVER:
                            // stop server
                            DiscordMessageController.stop_server(client, message, analyzer);
                            break
                        default:
                            // send error message
                            message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                            break;
                    }
                })
                .catch(() => {
                    // send error message
                    message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                })

        }
    }

    /**
     * start EC2 server instance
     * @param client 
     * @param message 
     * @param analyzer 
     */
    static start_server(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
        // create aws manager instance
        const aws_manager = new AwsManager({});

        // send message buffer
        let send_message: string = '';

        // send require message
        message.channel.send(`${constants.DISCORD_MESSAGE_START_SERVER}`);

        // start instance
        aws_manager.start_instance_returns_public_ip(constants.AWS_TARGET_INSTANCE_ID)
            .then((public_ip: string) => {
                // if ok, send message
                send_message = constants.DISCORD_MESSAGE_START_SERVER_SUCCESS.replace('%%PUBLIC_IP%%', public_ip);
                message.channel.send(send_message);
            })
            .catch((err) => {
                // send error message
                send_message = `${constants.DISCORD_MESSAGE_START_SERVER_FAILED} (Error : ${err})`;
                message.channel.send(send_message);
            });
    }

    /**
     * get EC2 instance public ip
     * @param client 
     * @param message 
     * @param analyzer 
     */
    static get_public_ip(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
        // create aws manager instance
        const aws_manager = new AwsManager({});

        // send message buffer
        let send_message: string = '';

        // get public ip
        aws_manager.get_public_ip(constants.AWS_TARGET_INSTANCE_ID)
            .then((public_ip: string) => {
                // if ok, send message
                send_message = constants.DISCORD_MESSAGE_GET_PUBLIC_IP_SUCCESS.replace('%%PUBLIC_IP%%', public_ip);
                message.channel.send(send_message);
            })
            .catch((err) => {
                // send error message
                send_message = `${constants.DISCORD_MESSAGE_GET_PUBLIC_IP_FAILED} (Error : ${err})`;
                message.channel.send(send_message);
            });
    }

    /**
     * stop EC2 server instance
     * @param client 
     * @param message 
     * @param analyzer 
     */
    static stop_server(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
        // create aws manager instance
        const aws_manager = new AwsManager({});

        // send message buffer
        let send_message: string = '';

        // stop instance
        aws_manager.stop_instance(constants.AWS_TARGET_INSTANCE_ID)
            .then(() => {
                // if ok, send message
                send_message = constants.DISCORD_MESSAGE_STOP_SERVER_SUCCESS;
                message.channel.send(send_message);
            })
            .catch((err) => {
                // send error message
                send_message = `${constants.DISCORD_MESSAGE_STOP_SERVER_FAILED} (Error : ${err})`;
                message.channel.send(send_message);
            });
    }
}