const { React } = require("powercord/webpack");
const { getModule } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");

//Getting shit manually since there aren't in code anymore
const DATA_MINED_GAMES = {
	STABLE: {
		"Poker Night": "755827207812677713",
		"Chess in the Park": "832012774040141894",
		"Letter League": "879863686565621790",
		SpellCast: "852509694341283871",
		"Watch Together:": "880218394199220334",
		"Checkers in the Park": "832013003968348200",
		"Word Snacks": "879863976006127627",
		"Blazing 8s": "832025144389533716",
		"Doodle Crew": "878067389634314250",
		"Bobble League": "947957217959759964",
		"Sketch Heads": "902271654783242291",
		"Land-io": "903769130790969345",
		"Putt Party": "945737671223947305"
	},
	DISABLED: {
		"Fishington.io": "814288819477020702",
		"Betrayal.io": "773336526917861400",
		"Sketchy Artist": "879864070101172255",
		Awkword: "879863881349087252"
	},
	DEV: {
		"Old Youtube": "755600276941176913",
		"Poker Night Staging": "763116274876022855",
		"Poker Night Dev": "763133495793942528",
		"Poker QA": "801133024841957428",
		"Chess in the Park 2 Staging": "832012730599735326",
		"Chess in the Park 2 Dev": "832012586023256104",
		"Chess in the Park 2 QA": "832012815819604009",
		"Chess in the Park 3 Staging": "832012938398400562",
		"Chess in the Park 3 Dev": "832012682520428625",
		"Chess in the Park 3 QA": "832012894068801636",
		"Watch YouTube Dev": "880218832743055411",
		"iframe-playground": "880559245471408169",
		"Doodle Crew Dev": "878067427668275241",
		"Letter Tile Dev": "879863753519292467",
		"Word Snacks Dev": "879864010126786570",
		"Fake Artist Dev": "879864104980979792",
		"Awkword Dev": "879863923543785532",
		"Decoders Dev": "891001866073296967",
		"SpellCast Staging": "893449443918086174",
		"Blazing 8s Dev": "832013108234289153",
		"Blazing 8s Staging": "832025061657280566",
		"Blazing 8s QA": "832025114077298718"
	}
};

module.exports = class PowercordTogether extends Plugin {
	async startPlugin() {
		powercord.api.settings.registerSettings("powercord-together", {
			category: this.entityID,
			label: "Powercord Together",
			render: (props) =>
				React.createElement(Settings, {
					...props
				})
		});

		this.patch();
	}

	async patch() {
		const GuildFunctions = getModule(["getGuildPermissionProps"], false);
		const { USE_EMBEDDED_ACTIVITIES } = getModule(["USE_EMBEDDED_ACTIVITIES"], false);

		inject("powercord-together-permissions", GuildFunctions.__proto__, "can", (args, res) => {
			if (args[0] === USE_EMBEDDED_ACTIVITIES) return true;

			return res;
		});

		const BundleFunctions = await getModule(["getBundleItems"]);

		inject("powercord-together-ids", BundleFunctions.__proto__, "getBundleItems", (args, res) => {
			return [
				...Object.values(DATA_MINED_GAMES.STABLE),
				...(this.settings.get("showDev", false) ? Object.values(DATA_MINED_GAMES.DEV) : []),
				...(this.settings.get("showDisabled", false) ? Object.values(DATA_MINED_GAMES.DISABLED) : [])
			].map((id) => ({
				application_id: id,
				expires_on: null,
				new_until: null,
				nitro_requirement: false,
				premium_tier_level: 0
			}));
		});
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings("powercord-together");

		uninject("powercord-together-ids");
		uninject("powercord-together-permissions");
	}
};
