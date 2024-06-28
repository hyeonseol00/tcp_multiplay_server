import { config } from '../config/config.js';

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
			console.log(packet);
		}
		else
		{
			break;
		}
	}
};