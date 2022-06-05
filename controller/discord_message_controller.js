"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// create message modules
const discord_message_analyzer_1 = require("./../logic/discord_message_analyzer");
// import logic
const aws_manager_1 = require("./../logic/aws_manager");
class DiscordMessageController {
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recieve_controller(client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger_1.logger.info(`recieved message : ${message.content}`);
            logger_1.logger.trace(message);
            // analyze message
            const analyzer = new discord_message_analyzer_1.DiscordMessageAnalyzer();
            analyzer.analyze(message.content, message.guild.id, message.author.id, client.user.id)
                .then(() => {
                logger_1.logger.trace(analyzer);
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
                        break;
                    default:
                        // send error message
                        message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                        break;
                }
            })
                .catch(() => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
            });
        }
    }
    /**
     * start EC2 server instance
     * @param client
     * @param message
     * @param analyzer
     */
    static start_server(client, message, analyzer) {
        // create aws manager instance
        const aws_manager = new aws_manager_1.AwsManager({});
        // send message buffer
        let send_message = '';
        // send require message
        message.channel.send(`${constants.DISCORD_MESSAGE_START_SERVER}`);
        // start instance
        aws_manager.start_instance_returns_public_ip(constants.AWS_TARGET_INSTANCE_ID)
            .then((public_ip) => {
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
    static get_public_ip(client, message, analyzer) {
        // create aws manager instance
        const aws_manager = new aws_manager_1.AwsManager({});
        // send message buffer
        let send_message = '';
        // get public ip
        aws_manager.get_public_ip(constants.AWS_TARGET_INSTANCE_ID)
            .then((public_ip) => {
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
    static stop_server(client, message, analyzer) {
        // create aws manager instance
        const aws_manager = new aws_manager_1.AwsManager({});
        // send message buffer
        let send_message = '';
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
exports.DiscordMessageController = DiscordMessageController;
//# sourceMappingURL=discord_message_controller.js.map