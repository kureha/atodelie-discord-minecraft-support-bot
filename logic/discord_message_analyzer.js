"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageAnalyzer = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class DiscordMessageAnalyzer {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        // remove user.id from message
        this.message = '';
        // this is "command" is valid
        this.owner_id = '';
        this.valid = false;
        this.error_messages = [];
        this.type = constants.TYPE_INIT;
    }
    /**
     * analyze discord message, save data to this instance.
     * @param mes discord message
     * @param server_id discord server id
     * @param message_user_id discord message's sender id
     * @param user_id discord bot's id
     */
    analyze(mes, server_id, message_user_id, user_id) {
        return new Promise((resolve, reject) => {
            // remove user.id from message
            this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");
            // detect server power on request
            if (DiscordMessageAnalyzer.check_server_start(this.message)) {
                logger_1.logger.info(`target message is server start request. message = ${this.message}`);
                // enable flags
                this.valid = true;
                this.type = constants.TYPE_START_SERVER;
                this.owner_id = message_user_id;
                // output dump
                logger_1.logger.debug(JSON.stringify(this));
                // ok
                resolve();
            }
            else if (DiscordMessageAnalyzer.check_get_public_ip(this.message)) {
                logger_1.logger.info(`target message is get public ip. message = ${this.message}`);
                // enable flags
                this.valid = true;
                this.type = constants.TYPE_GET_PUBLIC_IP;
                this.owner_id = message_user_id;
                // output dump
                logger_1.logger.debug(JSON.stringify(this));
                // ok
                resolve();
            }
            else if (DiscordMessageAnalyzer.check_stop_start(this.message)) {
                logger_1.logger.info(`target message is stop server. message = ${this.message}`);
                // enable flags
                this.valid = true;
                this.type = constants.TYPE_STOP_SERVER;
                this.owner_id = message_user_id;
                // output dump
                logger_1.logger.debug(JSON.stringify(this));
                // ok
                resolve();
            }
            else {
                // this is not valid message
                logger_1.logger.info(`target message is not valid. : mes = ${this.message}`);
                this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                // ng
                reject();
            }
        });
    }
    ;
    /**
     * extract message by regexp
     * @param mes message
     * @param regexp regexp's string
     */
    static extract_by_regexp(mes, regexp) {
        let result = undefined;
        // create RegExp from params
        const re = new RegExp(regexp, 'g');
        const re_result = re.exec(mes);
        // if include message return this
        if (re_result !== null && re_result.length > 0) {
            result = re_result[0];
        }
        return result;
    }
    /**
     * check message is server start
     * @param mes message
     * @returns
     */
    static check_server_start(mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_AWS_SERVER_START})`) === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * check message is get public ip
     * @param mes message
     * @returns
     */
    static check_get_public_ip(mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_AWS_SERVER_GET_PUBLIC_IP})`) === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * check message is server start
     * @param mes message
     * @returns
     */
    static check_stop_start(mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_AWS_SERVER_STOP})`) === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.DiscordMessageAnalyzer = DiscordMessageAnalyzer;
//# sourceMappingURL=discord_message_analyzer.js.map