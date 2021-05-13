const { getModule, getAllModules } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");

const { YOUTUBE_APPLICATION_ID, POKER_NIGHT_APPLICATION_ID, FISHINGTON_APPLICATION_ID, END_GAME_APPLICATION_ID } = getModule(["GENERIC_EVENT_EMBEDDED_APPS"], false);
const useExperiment = getAllModules(["useExperiment"], false)[35];
const getGuild = getModule(["getGuild"], false);

const ids = [YOUTUBE_APPLICATION_ID, POKER_NIGHT_APPLICATION_ID, FISHINGTON_APPLICATION_ID, END_GAME_APPLICATION_ID, "832012586023256104"];

module.exports = class PowercordTogether extends Plugin {
    async startPlugin() {
        inject("powercord-together-region", getGuild, "getGuild", (args, res) => {
            if (res) res.region = "us-west";
            return res;
        });

        inject("powercord-together-rocket", useExperiment, "useExperiment", (args, res) => {
            if (!args[0].guildId) return res;

            if (!res[0]?.enabledApplicationIds?.length) {
                res[0].enabledApplicationIds = ids;
                res[0].rtcPanelIconsOnly = true;
                res[0].showDiscordGameTooltips = true;
                res[0].useNewInviteButton = true;
            }

            return res;
        });
    }

    pluginWillUnload() {
        uninject("powercord-together-region");
        uninject("powercord-together-rocket");
    }
};
