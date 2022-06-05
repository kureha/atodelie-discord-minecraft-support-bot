import { AwsManager } from '../../logic/aws_manager';
import { Constants } from './../../common/constants';

const constants = new Constants();

test('test for get instance status', async () => {
    const aws_logic = new AwsManager({});
    try {
        const v = await aws_logic.get_instance_status(constants.AWS_TARGET_INSTANCE_ID);
        expect(v).toBe(false);
    } catch (err) {
        // error
        expect(true).toBe(false);
    }
});