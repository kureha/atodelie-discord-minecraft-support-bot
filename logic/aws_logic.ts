// define logger
import { logger } from './../common/logger';

// Load the AWS SDK for Node.js
import * as AWS from "aws-sdk";

/**
 * AWS Logic class
 */
export class AwsLogic {
  // variables
  private ec2: AWS.EC2;

  // ok string from AWS instance status
  static OK_STR: string = 'ok';
  static REGION: string = 'ap-northeast-1';

  /**
   * Constructor
   */
  constructor(client_config: AWS.EC2.ClientConfiguration) {
    // Set the region 
    AWS.config.update({ region: AwsLogic.REGION });
    // Create client
    this.ec2 = new AWS.EC2(client_config);
  }

  /**
   * start EC2 instance
   * @param instance_id 
   * @returns result
   */
  start_instance(instance_id: string): boolean {
    // create parameters
    var params: AWS.EC2.StartInstancesRequest = {
      InstanceIds: [
        instance_id
      ]
    };

    // result values
    let result: boolean = false;

    // start instance
    this.ec2.startInstances(params, ((err, data) => {


      // error checks
      if (err) {
        logger.error(err);
      } else {
        logger.info(JSON.stringify(data));
        result = true;
      }
    }));

    // return result
    return result;
  }


  /**
   * stop EC2 instance
   * @param instance_id 
   * @returns result
   */
  stop_instance(instance_id: string): boolean {
    // create parameters
    var params: AWS.EC2.StartInstancesRequest = {
      InstanceIds: [
        instance_id
      ]
    };

    // result values
    let result: boolean = false;

    // start instance
    this.ec2.stopInstances(params, ((err, data) => {


      // error checks
      if (err) {
        logger.error(err);
      } else {
        logger.info(JSON.stringify(data));
        result = true;
      }
    }));

    // return result
    return result;
  }

  /**
   * get EC2 instance status
   * @param instance_id 
   * @returns if instance is ok, return true
   */
  get_instance_status(instance_id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // result values
      let result: boolean = false;

      this.ec2.describeInstanceStatus({}, (err, data) => {
        // error check
        if (err) {
          logger.error(err);
          // reject
          reject(err);
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
              if (v.SystemStatus.Status == AwsLogic.OK_STR &&
                v.InstanceStatus.Status == AwsLogic.OK_STR) {
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
    const config: AWS.EC2.DescribeNetworkInterfacesRequest = {};

    return new Promise<string>((resolve, reject) => {
      // result values
      let result: string = '';
      this.ec2.describeNetworkInterfaces(config, (err: AWS.AWSError, data: AWS.EC2.DescribeNetworkInterfacesResult) => {

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
              }
            });
          }

          // error check
          if (result.length == 0) {
            reject(`Get network public ip failed`);
          }
        }
      });
    });
  }
}
