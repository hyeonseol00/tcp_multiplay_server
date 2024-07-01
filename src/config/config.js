import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
import { GAME_SESSION_ID } from '../constants/session.js';

export const config = {
	server: {
		port: PORT,
		host: HOST,
	},
	client: {
		version: CLIENT_VERSION,
	},
	packet: {
		totalLength: TOTAL_LENGTH,
		typeLength: PACKET_TYPE_LENGTH,
	},
	session: {
		id: GAME_SESSION_ID,
	}
};