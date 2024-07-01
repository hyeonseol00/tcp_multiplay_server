import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getAllGameSessions } from '../../session/game.session.js';
import { GAME_SESSION_ID } from '../../constants/env.js';
import joinGameHandler from '../game/joinGame.handler.js';
import createGameHandler from '../game/createGame.handler.js';

const initialHandler = async ({ socket, userId, payload }) =>
{
	try
	{
		const { deviceId } = payload;
		const gameSessions = getAllGameSessions();

		addUser(socket, deviceId);

		const initialResponse = createResponse(
			HANDLER_IDS.INITIAL,
			RESPONSE_SUCCESS_CODE,
			{ userId: deviceId },
			deviceId,
		);

		socket.write(initialResponse);

		if (gameSessions.length <= 0)
			createGameHandler({ socket, userId: deviceId, payload: { gameId: GAME_SESSION_ID } });
		else
			joinGameHandler({ socket, userId: deviceId, payload: { gameId: GAME_SESSION_ID } });
	}
	catch (err)
	{
		handleError(socket, err);
	}
};

export default initialHandler;
