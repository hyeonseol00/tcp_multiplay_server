import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getAllGameSessions } from '../../session/game.session.js';
import joinGameHandler from '../game/joinGame.handler.js';
import createGameHandler from '../game/createGame.handler.js';
import { config } from '../../config/config.js';

const initialHandler = async ({ socket, userId, payload }) =>
{
	try
	{
		const { deviceId, playerId, latency } = payload;
		const registerId = playerId ? playerId : deviceId;
		const gameSessions = getAllGameSessions();

		addUser(socket, registerId, latency);

		const initialResponse = createResponse(
			HANDLER_IDS.INITIAL,
			RESPONSE_SUCCESS_CODE,
			{ userId: registerId },
		);

		socket.write(initialResponse);

		if (gameSessions.length <= 0)
			createGameHandler({ socket, userId: registerId, payload: { gameId: config.session.id } });
		else
			joinGameHandler({ socket, userId: registerId, payload: { gameId: config.session.id } });
	}
	catch (err)
	{
		handleError(socket, err);
	}
};

export default initialHandler;
