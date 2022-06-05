"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsManager = void 0;
// define logger
const logger_1 = require("../common/logger");
// Load the AWS SDK for Node.js
const AWS = __importStar(require("aws-sdk"));
// Load setTimeout
const promises_1 = require("timers/promises");
/**
 * AWS Logic class
 */
class AwsManager {
    /**
     * Constructor
     */
    constructor(client_config) {
        // Set the region 
        AWS.config.update({ region: AwsManager.REGION });
        // Create client
        this.ec2 = new AWS.EC2(client_config);
        // set default dry run is false
        this.is_dry_run = false;
    }
    /**
     * start EC2 instance and get public ip.
     * @param instance_id
     * @returns public ip address
     */
    start_instance_returns_public_ip(instance_id) {
        const INTERVAL_TIME = 60000;
        return new Promise((resolve, reject) => {
            return this.start_instance(instance_id)
                .then(() => {
                // sleep interval
                logger_1.logger.info(`sleep intervals. interval = ${INTERVAL_TIME}`);
                return (0, promises_1.setTimeout)(INTERVAL_TIME, {});
            })
                .then(() => {
                // get public ip
                logger_1.logger.info(`try to get public ip.`);
                return this.get_public_ip(instance_id);
            })
                .then((public_ip) => {
                logger_1.logger.info(`get public ip ok. public_ip = ${public_ip}`);
                resolve(public_ip);
            })
                .catch((e) => {
                logger_1.logger.error(e);
                reject(e);
            });
        });
    }
    /**
     * start EC2 instance
     * @param instance_id
     * @returns result
     */
    start_instance(instance_id) {
        return new Promise((resolve, reject) => {
            // create parameters
            const params = {
                InstanceIds: [
                    instance_id
                ],
                DryRun: this.is_dry_run
            };
            // start instance
            this.ec2.startInstances(params, ((err, data) => {
                // error checks
                if (err) {
                    logger_1.logger.error(err);
                    reject(err);
                }
                else {
                    logger_1.logger.info(JSON.stringify(data));
                    resolve();
                }
            }));
        });
    }
    /**
     * stop EC2 instance
     * @param instance_id
     * @returns result
     */
    stop_instance(instance_id) {
        return new Promise((resolve, reject) => {
            // create parameters
            const params = {
                InstanceIds: [
                    instance_id
                ],
                DryRun: this.is_dry_run
            };
            // start instance
            this.ec2.stopInstances(params, ((err, data) => {
                // error checks
                if (err) {
                    logger_1.logger.error(err);
                    reject(err);
                }
                else {
                    logger_1.logger.info(JSON.stringify(data));
                    resolve();
                }
            }));
        });
    }
    /**
     * get EC2 instance status
     * @param instance_id
     * @returns if instance is ok, return true
     */
    get_instance_status(instance_id) {
        return new Promise((resolve, reject) => {
            // create parameters
            const params = {
                InstanceIds: [
                    instance_id
                ],
                DryRun: this.is_dry_run
            };
            // result values
            let result = false;
            this.ec2.describeInstanceStatus(params, (err, data) => {
                // error check
                if (err) {
                    logger_1.logger.error(err);
                    // reject
                    reject(err);
                    return;
                }
                else {
                    logger_1.logger.info(JSON.stringify(data));
                    // check values
                    if (data.InstanceStatuses == undefined || data.InstanceStatuses.length == 0) {
                        // error
                        logger_1.logger.error(`Get instance status failed.`);
                    }
                    else {
                        data.InstanceStatuses.forEach((v) => {
                            // check values
                            if (v == undefined || v.SystemStatus == undefined || v.InstanceStatus == undefined) {
                                // logger.error(`Target instance statuses or system status or instance status is undefined.`)
                                // logger.error(v);
                                return;
                            }
                            // Check status
                            if (v.SystemStatus.Status == AwsManager.OK_STR &&
                                v.InstanceStatus.Status == AwsManager.OK_STR) {
                                logger_1.logger.info(`Status check ok.`);
                                result = true;
                            }
                            else {
                                logger_1.logger.error(`Status check failed.`);
                                logger_1.logger.error(v);
                            }
                        });
                    }
                }
                logger_1.logger.info(`return result : ${result}`);
                resolve(result);
            });
        });
    }
    /**
     * get EC2 public ip
     * @param instance_id target instance id
     * @returns return public ip if instance is ok
     */
    get_public_ip(instance_id) {
        // create parameters
        const params = {
            DryRun: this.is_dry_run
        };
        return new Promise((resolve, reject) => {
            // result values
            let result = '';
            this.ec2.describeNetworkInterfaces(params, (err, data) => {
                // error check
                if (err) {
                    // if error, reject
                    logger_1.logger.error(`AWS AescribeNetworkInterfaces Error.`);
                    logger_1.logger.error(err);
                }
                else {
                    // get success
                    logger_1.logger.info(`AWS AescribeNetworkInterfaces Successed.`);
                    logger_1.logger.trace(JSON.stringify(data));
                    // check values
                    if (data.NetworkInterfaces == undefined || data.NetworkInterfaces.length == 0) {
                        // error
                        logger_1.logger.error(`Get netrowk interfaces failed.`);
                    }
                    else {
                        data.NetworkInterfaces.forEach((v) => {
                            // check values
                            if (v == undefined || v.Association == undefined || v.Association.PublicIp == undefined || v.Attachment == undefined) {
                                // logger.error(`Target network interfaces or association or public ip or attachment is undefined.`)
                                // logger.error(v);
                                return;
                            }
                            ;
                            if (v.Attachment.InstanceId == instance_id) {
                                result = v.Association.PublicIp;
                                logger_1.logger.info(`instance id is matched. get public ip. instance_id = ${instance_id}, public_ip = ${result}`);
                                // return result
                                resolve(result);
                                return;
                            }
                        });
                    }
                    // error check
                    if (result.length == 0) {
                        logger_1.logger.error(`Get network public ip failed`);
                        reject(`Get network public ip failed`);
                    }
                }
            });
        });
    }
}
exports.AwsManager = AwsManager;
// ok string from AWS instance status
AwsManager.OK_STR = 'ok';
AwsManager.REGION = 'ap-northeast-1';
//# sourceMappingURL=aws_manager.js.map