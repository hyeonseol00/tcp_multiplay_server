import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) =>
{
	socket.buffer = Buffer.concat([socket.buffer, data]);
	const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

	while (socket.buffer.length >= totalHeaderLength)
	{
		const length = socket.buffer.readUInt32BE(0);
		const packetType = socket.buffer.readUInt8(config.packet.totalLength);

		if (socket.buffer.length >= length)
		{
			const packet = socket.buffer.slice(totalHeaderLength, length);
			socket.buffer = socket.buffer.slice(length);

			console.log(`패킷 길이: ${length}`);
			console.log(`패킷 타입: ${packetType}`);

			switch (packetType)
			{
				case PACKET_TYPE.PING:
					break;
				case PACKET_TYPE.NORMAL:
					const { handlerId, sequence, payload, userId } = packetParser(packet);

					console.log('핸들러 ID:', handlerId);
					console.log('유저 ID:', userId);
					console.log('페이로드:', payload);
					console.log('시퀀스:', sequence);
			}
		}
		else
		{
			break;
		}
	}
};