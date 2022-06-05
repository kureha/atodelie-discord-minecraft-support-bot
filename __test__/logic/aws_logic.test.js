"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_manager_1 = require("../../logic/aws_manager");
const constants_1 = require("./../../common/constants");
const constants = new constants_1.Constants();
test('test for get instance status', () => __awaiter(void 0, void 0, void 0, function* () {
    const aws_logic = new aws_manager_1.AwsManager({});
    try {
        const v = yield aws_logic.get_instance_status(constants.AWS_TARGET_INSTANCE_ID);
        expect(v).toBe(false);
    }
    catch (err) {
        // error
        expect(true).toBe(false);
    }
}));
//# sourceMappingURL=aws_logic.test.js.map