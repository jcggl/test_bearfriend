import * as poseDetection from '@tensorflow-models/pose-detection';
import { PixelInput, Result, Solution } from './index';

class Pose implements Solution<poseDetection.Pose, poseDetection.PoseDetector> {
    module: poseDetection.PoseDetector;

    async init(): Promise<void | Error> {
        this.module = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).catch((err) => {
            return err;
        });
    }
    async get(input: PixelInput): Promise<Result<poseDetection.Pose>> {
        const result: Result<poseDetection.Pose> = {
            data: [],
            modelName: 'pose',
        };

        result.data = await this.module.estimatePoses(input, { flipHorizontal: false });

        this.module.reset();

        return result;
    }
}

export default Pose;