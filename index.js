const { getModule, getAllModules, React } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");
const { Menu } = require("powercord/components");

const { createInvite, transitionToInvite } = getModule(["createInvite"], false);
const { getSelfEmbeddedActivityForChannel } = getModule(["getSelfEmbeddedActivityForChannel"], false);

const { can } = getModule(["getHighestRole"], false);
const { Permissions } = getModule(["Permissions"], false);

const buttons = [
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
    }
];

module.exports = class PowercordTogether extends Plugin {
    async startPlugin() {
        const ChannelContextMenu = await getAllModules((m) => m?.default?.displayName == "ChannelListVoiceChannelContextMenu")[0];

        inject("powercord-together", ChannelContextMenu, "default", (args, res) => {
            const selectedChannel = args[0].channel;

            if (!selectedChannel || !selectedChannel.guild_id || !can(Permissions.CREATE_INSTANT_INVITE, selectedChannel) || getSelfEmbeddedActivityForChannel(selectedChannel.id)) return res;

            const items = buttons.map(({ id, label, application_id }) =>
                React.createElement(Menu.MenuItem, {
                    id,
                    label,
                    action: async () => {
                        const invite = await createInvite(selectedChannel.id, {
                            max_age: 86400,
                            max_uses: 0,
                            target_application_id: application_id,
                            target_type: 2,
                            temporary: false,
                            validate: null
                        }).catch((e) => null);

                        if (!invite) return;

                        await transitionToInvite(invite);
                    }
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

    pluginWillUnload() {
        uninject("powercord-together");
    }
};
