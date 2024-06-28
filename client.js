import net from 'net';

const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트

const readHeader = (buffer) =>
{
	return {
		length: buffer.readUInt32BE(0),
		packetType: buffer.writeUInt8(TOTAL_LENGTH),
	};
};

const writeHeader = (length, packetType) =>
{
	const headerSize = TOTAL_LENGTH + PACKET_TYPE_LENGTH;
	const buffer = Buffer.alloc(headerSize);
	buffer.writeUInt32BE(length + headerSize, 0);
	buffer.writeUInt8(packetType, TOTAL_LENGTH);
	return buffer;
};

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () =>
{
	console.log('서버 연결 성공');

	const message = 'Hi, There!';
	const test = Buffer.from(message);

	const header = writeHeader(test.length, 11);
	const packet = Buffer.concat([header, test]);
	client.write(packet);
});

client.on('data', (data) =>
{
	const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

	const { handlerId, length } = readHeader(buffer);
	console.log(`핸들러 ID: ${handlerId}`);
	console.log(`패킷 길이: ${length}`);

	const headerSize = TOTAL_LENGTH + PACKET_TYPE_LENGTH;
	// 메시지 추출
	const message = buffer.slice(headerSize); // 앞의 헤더 부분을 잘라낸다.

	console.log(`서버에게 받은 메세지: ${message}`);
});

client.on('close', () =>
{
	console.log('서버와 연결 해제');
});

client.on('error', (err) =>
{
	console.error('클라이언트 에러:', err);
});

process.on('SIGINT', () =>
{
	client.end('클라이언트가 종료됩니다.', () =>
	{
		process.exit(0);
	});
});