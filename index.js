const { getModule } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");

const { WATCH_YOUTUBE_PROD_APP_ID, POKER_NIGHT_APPLICATION_ID, FISHINGTON_APPLICATION_ID, END_GAME_APPLICATION_ID } = getModule(
	["WATCH_YOUTUBE_PROD_APP_ID"],
	false
);

const Activities = getModule(["getEnabledAppIds"], false);

module.exports = class PowercordTogether extends Plugin {
	async startPlugin() {
		inject("powercord-together-ids", Activities.__proto__, "getEnabledAppIds", () => {
			return [
				WATCH_YOUTUBE_PROD_APP_ID,
				POKER_NIGHT_APPLICATION_ID,
				FISHINGTON_APPLICATION_ID,
				END_GAME_APPLICATION_ID,
				// some games that i couldn't find except by manually grabbing from discordgamelab server
				"832012774040141894", // chess
				"878067389634314250", // doodle
				"879863976006127627", // word snacks
				"879863686565621790" // letter tile
			];
		});

		inject("powercord-together-rocket", Activities.__proto__, "isActivitiesEnabled", () => {
			return true;
		});
	}

	pluginWillUnload() {
		uninject("powercord-together-rocket");
		uninject("powercord-together-ids");
	}
};
