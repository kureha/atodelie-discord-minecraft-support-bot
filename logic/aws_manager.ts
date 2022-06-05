// define logger
import { logger } from '../common/logger';

// Load the AWS SDK for Node.js
import * as AWS from "aws-sdk";

// Load setTimeout
import { setTimeout } from "timers/promises";

/**
 * AWS Logic class
 */
export class AwsManager {
  // variables
  private ec2: AWS.EC2;
  is_dry_run: boolean;

  // ok string from AWS instance status
  static OK_STR: string = 'ok';
  static REGION: string = 'ap-northeast-1';

  /**
   * Constructor
   */
  constructor(client_config: AWS.EC2.ClientConfiguration) {
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
  start_instance_returns_public_ip(instance_id: string): Promise<string> {
    const INTERVAL_TIME: number = 60000;

    return new Promise((resolve, reject) => {
      return this.start_instance(instance_id)
        .then(() => {
          // sleep interval
          logger.info(`sleep intervals. interval = ${INTERVAL_TIME}`);
          return setTimeout(INTERVAL_TIME, {});
        })
        .then(() => {
          // get public ip
          logger.info(`try to get public ip.`);
          return this.get_public_ip(instance_id);
        })
        .then((public_ip: string) => {
          logger.info(`get public ip ok. public_ip = ${public_ip}`);
          resolve(public_ip);
        })
        .catch((e) => {
          logger.error(e);
          reject(e);
        })
    });
  }

  /**
   * start EC2 instance
   * @param instance_id 
   * @returns result
   */
  start_instance(instance_id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // create parameters
      const params: AWS.EC2.StartInstancesRequest = {
        InstanceIds: [
          instance_id
        ],
        DryRun: this.is_dry_run
      };

      // start instance
      this.ec2.startInstances(params, ((err, data) => {
        // error checks
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          logger.info(JSON.stringify(data));
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
  stop_instance(instance_id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // create parameters
      const params: AWS.EC2.StopInstancesRequest = {
        InstanceIds: [
          instance_id
        ],
        DryRun: this.is_dry_run
      };

      // start instance
      this.ec2.stopInstances(params, ((err, data) => {
        // error checks
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          logger.info(JSON.stringify(data));
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
  get_instance_status(instance_id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // create parameters
      const params: AWS.EC2.DescribeInstanceStatusRequest = {
        InstanceIds: [
          instance_id
        ],
        DryRun: this.is_dry_run
      };

      // result values
      let result: boolean = false;

      this.ec2.describeInstanceStatus(params, (err, data) => {
        // error check
        if (err) {
          logger.error(err);
          // reject
          reject(err);
          return;
        } else {
          logger.info(JSON.stringify(data));

          // check values
          if (data.InstanceStatuses == undefined || data.InstanceStatuses.length == 0) {
            // error
            logger.error(`Get instance status failed.`);
          } else {
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
                logger.info(`Status check ok.`);
                result = true;
              } else {
                logger.error(`Status check failed.`);
                logger.error(v);
              }
            });
          }
        }
        logger.info(`return result : ${result}`);
        resolve(result);
      });
    });
  }

  /**
   * get EC2 public ip
   * @param instance_id target instance id
   * @returns return public ip if instance is ok
   */
  get_public_ip(instance_id: string): Promise<string> {
    // create parameters
    const params: AWS.EC2.DescribeNetworkInterfacesRequest = {
      DryRun: this.is_dry_run
    };

    return new Promise<string>((resolve, reject) => {
      // result values
      let result: string = '';
      this.ec2.describeNetworkInterfaces(params, (err: AWS.AWSError, data: AWS.EC2.DescribeNetworkInterfacesResult) => {

        // error check
        if (err) {
          // if error, reject
          logger.error(`AWS AescribeNetworkInterfaces Error.`)
          logger.error(err);
        } else {
          // get success
          logger.info(`AWS AescribeNetworkInterfaces Successed.`);
          logger.trace(JSON.stringify(data));

          // check values
          if (data.NetworkInterfaces == undefined || data.NetworkInterfaces.length == 0) {
            // error
            logger.error(`Get netrowk interfaces failed.`);
          } else {
            data.NetworkInterfaces.forEach((v: AWS.EC2.NetworkInterface) => {
              // check values
              if (v == undefined || v.Association == undefined || v.Association.PublicIp == undefined || v.Attachment == undefined) {
                // logger.error(`Target network interfaces or association or public ip or attachment is undefined.`)
                // logger.error(v);
                return;
              };

              if (v.Attachment.InstanceId == instance_id) {
                result = v.Association.PublicIp;
                logger.info(`instance id is matched. get public ip. instance_id = ${instance_id}, public_ip = ${result}`);
                // return result
                resolve(result);
                return;
              }
            });
          }

          // error check
          if (result.length == 0) {
            logger.error(`Get network public ip failed`);
            reject(`Get network public ip failed`);
          }
        }
      });
    });
  }
}