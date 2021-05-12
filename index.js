const { getModule, getAllModules, React } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");
const { Menu } = require("powercord/components");

const { startEmbeddedActivity } = getModule(["startEmbeddedActivity"], false);
const { transitionTo } = getModule(["transitionTo"], false);
const { Routes } = getModule(["Routes"], false);
const { getSelfEmbeddedActivityForChannel } = getModule(["getSelfEmbeddedActivityForChannel"], false);
const { GENERIC_EVENT_EMBEDDED_APPS } = getModule(["GENERIC_EVENT_EMBEDDED_APPS"], false);

const knownGames = [
    {
        id: "youtube",
        label: "Youtube Sync",
        application_id: "755600276941176913"
    },
    {
        id: "poker",
        label: "Poker Night",
        application_id: "755827207812677713"
    },
    {
        id: "betrayal",
        label: "Betrayal.io",
        application_id: "773336526917861400"
    },
    {
        id: "fishing",
        label: "Fishington.io",
        application_id: "814288819477020702"
    },
    {
        id: "chess",
        label: "Chess",
        application_id: "832012586023256104"
    }
];

module.exports = class PowercordTogether extends Plugin {
    async startPlugin() {
        const ChannelContextMenu = await getAllModules((m) => m?.default?.displayName == "ChannelListVoiceChannelContextMenu")[0];

        inject("powercord-together", ChannelContextMenu, "default", (args, res) => {
            const selectedChannel = args[0].channel;

            if (!selectedChannel || !selectedChannel.guild_id || getSelfEmbeddedActivityForChannel(selectedChannel.id)) return res;

            const noNamed = [];

            const items = [];

            Array.from(GENERIC_EVENT_EMBEDDED_APPS).map((application_id, i) => {
                const known = knownGames.find((o) => o.application_id === application_id);
                if (known) {
                    items.push(
                        this.createInviteEl(
                            {
                                id: known.id,
                                label: known.label,
                                application_id
                            },
                            selectedChannel
                        )
                    );
                } else {
                    noNamed.push(
                        this.createInviteEl(
                            {
                                id: `unnamed-${i + 1 - knownGames.length}`,
                                label: `Unnamed${i + 1 - knownGames.length}`,
                                application_id
                            },
                            selectedChannel
                        )
                    );
                }
            });

            if (noNamed.length)
                items.push(
                    React.createElement(Menu.MenuItem, {
                        id: "unnamed-menu",
                        label: "Unnamed Games",
                        children: noNamed
                    })
                );

            res.props.children.splice(
                res.props.children.length - 1,
                0,
                React.createElement(Menu.MenuItem, {
                    id: "powercord-together-menu",
                    label: "Powercord Together",
                    children: items
                })
            );

            return res;
        });

        ChannelContextMenu.default.displayName = "ChannelListVoiceChannelContextMenu";
    }

    createInviteEl(game, selectedChannel) {
        return React.createElement(Menu.MenuItem, {
            id: game.id,
            label: game.label,
            action: async () => {
                await startEmbeddedActivity(selectedChannel.id, game.application_id);

                await transitionTo(Routes.CHANNEL(selectedChannel.guild_id, selectedChannel.id));
            }
        });
    }

    pluginWillUnload() {
        uninject("powercord-together");
    }
};
