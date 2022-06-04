export class Constants {
    // common section
    DISCORD_BOT_TOKEN: string;
    DISCORD_BOT_ADMIN_USER_ID: string;
    DISCORD_LATEST_LIST_LENGTH: number;
    DISCORD_FOLLOW_MINUTE: number;
    DISCORD_FOLLOW_CRON: string;
    DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE: number;
    DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL: string;

    static STRING_EMPTY = '';

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
    }

    /**
     * get default data for this system
     * @returns date instance of '2000-01-01 00:00:00'
     */
    static get_default_date(): Date {
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
    static get_escaped_regexp_string_from_env(v: string | undefined, split_char: string): string {
        if (v === undefined) {
            return '';
        } else {
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
    static escape_regexp(v: string) {
        return v.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
    }
};