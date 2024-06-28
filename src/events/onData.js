import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';
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

			try
			{
				switch (packetType)
				{
					case PACKET_TYPE.PING:
						break;
					case PACKET_TYPE.NORMAL:
						const { handlerId, sequence, payload, userId } = packetParser(packet);

						const user = getUserById(userId);
						if (user && user.sequence !== sequence)
							throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');

						const handler = getHandlerById(handlerId);
						await handler({
							socket,
							userId,
							payload,
						});
				}
			}
			catch (err)
			{
				handleError(socket, err);
			}
		}
		else
		{
			break;
		}
	}
};