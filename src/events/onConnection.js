import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket) =>
{
	console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);
	console.log("현재 접속 중인 유저: ", gameSession.getAllUserIds());

	socket.buffer = Buffer.alloc(0);

	socket.on('data', onData(socket));
	socket.on('end', onEnd(socket));
	socket.on('error', onError(socket));
};
