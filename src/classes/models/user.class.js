import { createPingPacket } from '../../utils/notification/game.notification.js';

class User
{
	constructor(id, playerId, socket, latency, x, y)
	{
		this.id = id;
		this.playerId = playerId;
		this.socket = socket;
		this.x = x;
		this.y = y;
		this.lastUpdateTime = Date.now();
		this.latency = latency;
	}

	updatePosition(x, y)
	{
		this.x = x;
		this.y = y;
		this.lastUpdateTime = Date.now();
	}

	ping()
	{
		const now = Date.now();

		console.log(`${this.id}: ping`);
		this.socket.write(createPingPacket(now));
	}

	handlePong(data)
	{
		const now = Date.now();
		this.latency = (now - data.timestamp) / 2;
		console.log(`${now}에 사용자 ${this.id}로부터 pong을 수신했습니다. 지연 시간: ${this.latency}ms`);
	}

	calculatePosition(latency)
	{
		const timeDiff = latency / 1000;
		const speed = 1;
		const distance = speed * timeDiff;

		return {
			x: this.x,
			y: this.y,
		};
	}
}

export default User;
