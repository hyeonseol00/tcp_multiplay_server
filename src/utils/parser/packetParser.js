import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) =>
{
	const protoMessages = getProtoMessages();
	const Packet = protoMessages.common.Packet;
	let packet;

	try
	{
		packet = Packet.decode(data);
	}
	catch (err)
	{
		console.error(err);
	}

	const handlerId = packet.handlerId;
	const userId = packet.userId;
	const clientVersion = packet.clientVersion;
	const sequence = packet.sequence;

	console.log('클라이언트 버전:', clientVersion);

	const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
	if (!protoTypeName)
		console.error(`알 수 없는 핸들러 ID: ${handlerId}`);

	const [namespace, typeName] = protoTypeName.split('.');
	const PayloadType = protoMessages[namespace][typeName];
	let payload;
	payload = PayloadType.decode(packet.payload);

	return { handlerId, userId, payload, sequence };
};