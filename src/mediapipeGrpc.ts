import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall } from '@grpc/grpc-js';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import { HolisticRequest, HolisticResponse, HolisticServiceService } from './protos/holistic';
import MediaPipeService from './services/mediapipe';

const ipaddr = 'localhost';
const portList = MDPIPE_SERVER_PORT_LIST;

if (!process.env.SV_NUM) {
    throw new Error('0~5를 입력하세요');
}

const port = portList[Number(process.env.SV_NUM)];

const server = new Server({
    'grpc.max_send_message_length': 1000000000000,
    'grpc.max_receive_message_length': 1000000000000,
});
const mpSvc = new MediaPipeService();

server.addService(HolisticServiceService, { getHolistics: getHolistics });
server.bindAsync(`${ipaddr}:${port}`, ServerCredentials.createInsecure(), () => {
    console.log(`Listening on ${ipaddr}:${port}`);
    server.start();
});

function getHolistics(call: ServerUnaryCall<HolisticRequest, HolisticResponse>, send: sendUnaryData<HolisticResponse>) {
    const ImagesBufferMap = new Map<number, Buffer>();

    call.request.request.forEach((d) => {
        ImagesBufferMap.set(d.index, Buffer.from(d.data, 'base64'));
    });

    const response: HolisticResponse = {
        result: [],
    };
    mpSvc.getHolistics(ImagesBufferMap).then((v) => {
        response.result = v;
        send(null, response);
    });
}