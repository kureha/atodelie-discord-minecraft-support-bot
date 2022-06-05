"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
    /**
     * constructor, set all value from process.env
     * @constructor
     */
    constructor() {
        // readed from env file
        require('dotenv').config();
        // common section
        this.DISCORD_BOT_TOKEN = process.env['DISCORD_BOT_TOKEN'] || Constants.STRING_EMPTY;
        this.DISCORD_BOT_ADMIN_USER_ID = process.env['DISCORD_BOT_ADMIN_USER_ID'] || Constants.STRING_EMPTY;
        this.DISCORD_LATEST_LIST_LENGTH = parseInt(process.env['DISCORD_LATEST_LIST_LENGTH'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_LATEST_LIST_LENGTH)) {
            // set default
            this.DISCORD_LATEST_LIST_LENGTH = 3;
        }
        this.DISCORD_FOLLOW_MINUTE = parseInt(process.env['DISCORD_FOLLOW_MINUTE'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_FOLLOW_MINUTE)) {
            // set default
            this.DISCORD_FOLLOW_MINUTE = 30;
        }
        this.DISCORD_FOLLOW_CRON = process.env['DISCORD_FOLLOW_CRON'] || Constants.STRING_EMPTY;
        this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = parseInt(process.env['DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE)) {
            // set default
            this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = 0;
        }
        // create sql strings
        this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL = `-${this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE} minutes`;
        // message section
        this.DISCORD_MESSAGE_START_SERVER = process.env['DISCORD_MESSAGE_START_SERVER'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_START_SERVER_SUCCESS = process.env['DISCORD_MESSAGE_START_SERVER_SUCCESS'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_START_SERVER_FAILED = process.env['DISCORD_MESSAGE_START_SERVER_FAILED'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_GET_PUBLIC_IP_SUCCESS = process.env['DISCORD_MESSAGE_GET_PUBLIC_IP_SUCCESS'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_GET_PUBLIC_IP_FAILED = process.env['DISCORD_MESSAGE_GET_PUBLIC_IP_FAILED'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_STOP_SERVER_SUCCESS = process.env['DISCORD_MESSAGE_STOP_SERVER_SUCCESS'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_STOP_SERVER_FAILED = process.env['DISCORD_MESSAGE_STOP_SERVER_FAILED'] || Constants.STRING_EMPTY;
        // message error section
        this.DISCORD_ACTIVITY_NAME = process.env['DISCORD_ACTIVITY_NAME'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_IS_INVALID = process.env['DISCORD_MESSAGE_IS_INVALID'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TYPE_INVALID = process.env['DISCORD_MESSAGE_TYPE_INVALID'] || Constants.STRING_EMPTY;
        // command section
        this.DISCORD_COMMAND_AWS_SERVER_START = process.env['DISCORD_COMMAND_AWS_SERVER_START'] || Constants.STRING_EMPTY;
        this.DISCORD_COMMAND_AWS_SERVER_GET_PUBLIC_IP = process.env['DISCORD_COMMAND_AWS_SERVER_GET_PUBLIC_IP'] || Constants.STRING_EMPTY;
        this.DISCORD_COMMAND_AWS_SERVER_STOP = process.env['DISCORD_COMMAND_AWS_SERVER_STOP'] || Constants.STRING_EMPTY;
        // aws section
        this.AWS_TARGET_INSTANCE_ID = process.env['aws_target_instance_id'] || Constants.STRING_EMPTY;
        // static values
        this.ID_INVALID = -1;
        this.TYPE_INIT = 0;
        this.TYPE_START_SERVER = 1;
        this.TYPE_GET_PUBLIC_IP = 2;
        this.TYPE_STOP_SERVER = 3;
    }
    /**
     * get default data for this system
     * @returns date instance of '2000-01-01 00:00:00'
     */
    static get_default_date() {
        const temp_date = new Date();
        temp_date.setFullYear(2000);
        temp_date.setMonth(0);
        temp_date.setDate(1);
        temp_date.setHours(0);
        temp_date.setMinutes(0);
        temp_date.setSeconds(0);
        temp_date.setMilliseconds(0);
        return temp_date;
    }
    /**
     * get escape string from env file
     * @param v non-escaped regexp string list
     * @param split_char list split char
     * @returns regexp escaped string (not list)
     */
    static get_escaped_regexp_string_from_env(v, split_char) {
        if (v === undefined) {
            return '';
        }
        else {
            v.split(split_char).forEach(e => {
                e = Constants.escape_regexp(e);
            });
            return v.split(split_char).join('|');
        }
    }
    /**
     * escape string for regexp (e.g. escape user input string)
     * @param v regexp string non-escaped
     * @returns escaped regexp string
     */
    static escape_regexp(v) {
        return v.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
    }
}
exports.Constants = Constants;
Constants.STRING_EMPTY = '';
;
//# sourceMappingURL=constants.js.map