import CustomError from '../utils/error/customError.js';

export const onError = (socket) => (err) =>
{
	handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

	removeUser(socket);
};