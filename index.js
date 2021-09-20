const { getModule } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");

const {
	YOUTUBE_APPLICATION_ID,
	POKER_NIGHT_APPLICATION_ID,
	FISHINGTON_APPLICATION_ID,
	END_GAME_APPLICATION_ID,
	CHESS_IN_THE_PARK_APPLICATION_ID
} = getModule(["YOUTUBE_APPLICATION_ID"], false);

module.exports = class PowercordTogether extends Plugin {
	async startPlugin() {
		inject("powercord-together-region", getModule(["getGuild"], false), "getGuild", (args, res) => {
			if (res) res.region = "us-west";
			return res;
		});

		inject("powercord-together-ids", getModule(["getEnabledAppIds"], false), "getEnabledAppIds", (args, res) => {
			res = [
				YOUTUBE_APPLICATION_ID,
				POKER_NIGHT_APPLICATION_ID,
				FISHINGTON_APPLICATION_ID,
				END_GAME_APPLICATION_ID,
				CHESS_IN_THE_PARK_APPLICATION_ID
			];
			return res;
		});

		inject(
			"powercord-together-rocket",
			getModule((obj) => obj?.definition?.label === "Activities Experiment", false),
			"useExperiment",
			(args, res) => {
				if (!args[0].guildId) return res;

				if (!res[0]?.enabledApplicationIds?.length) {
					res[0] = {
						rtcPanelIconsOnly: true,
						showDiscordGameTooltips: false,
						enableActivities: true,
						useNewInviteButton: true
					};
				}

				return res;
			}
		);
	}

	pluginWillUnload() {
		uninject("powercord-together-region");
		uninject("powercord-together-rocket");
		uninject("powercord-together-ids");
	}
};
