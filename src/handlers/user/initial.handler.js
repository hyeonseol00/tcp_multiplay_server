import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getAllGameSessions } from '../../session/game.session.js';
import joinGameHandler from '../game/joinGame.handler.js';
import createGameHandler from '../game/createGame.handler.js';
import { config } from '../../config/config.js';
import { createUserbackupCoordinate, findUserByDeviceID } from '../../db/backup/coordinates.db.js';

const initialHandler = async ({ socket, userId, payload }) =>
{
	try
	{
		const { deviceId, playerId, latency } = payload;
		const gameSessions = getAllGameSessions();

		let user = await findUserByDeviceID(deviceId);

		if (!user)
			user = await createUserbackupCoordinate(deviceId);

		addUser(socket, deviceId, playerId, latency, user.x, user.y);

		const initialResponse = createResponse(
			HANDLER_IDS.INITIAL,
			RESPONSE_SUCCESS_CODE,
			{ userId: deviceId },
		);

		socket.write(initialResponse);

		if (gameSessions.length <= 0)
			createGameHandler({ socket, userId: deviceId, payload: { gameId: config.session.id } });
		else
			joinGameHandler({ socket, userId: deviceId, payload: { gameId: config.session.id } });
	}
	catch (err)
	{
		handleError(socket, err);
	}
};

export default initialHandler;
