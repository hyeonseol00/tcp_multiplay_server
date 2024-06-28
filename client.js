import net from 'net';

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () =>
{
	console.log('서버 연결 성공');
});

client.on('data', (data) =>
{
	console.log(data);
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