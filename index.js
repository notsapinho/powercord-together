const { React } = require("powercord/webpack");
const { getModule } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");

const Activities = getModule(["getEnabledAppIds"], false);


//Getting shit manually since there aren't in code anymore
const DATA_MINED_GAMES = {
	STABLE: {
		"Watch YouTube": "880218394199220334",
		"Poker Night": "755827207812677713",
		"Fishington.io": "814288819477020702",
		"Betrayal.io": "773336526917861400",
		"Chess in the Park": "832012774040141894",
		Putts: "832012854282158180",
		"Doodle Crew": "878067389634314250",
		"Letter Tile": "879863686565621790",
		"Word Snacks": "879863976006127627",
		"Fake Artist": "879864070101172255",
		Awkword: "879863881349087252",
		SpellCast: "852509694341283871"
	},
	DEV: {
		"Poker Night Staging": "763116274876022855",
		"Poker Night Dev": "763133495793942528",
		"Poker QA": "801133024841957428",
		"Chess in the Park 2 Staging": "832012730599735326",
		"Chess in the Park 2 Dev": "832012586023256104",
		"Chess in the Park 2 QA": "832012815819604009",
		"Chess in the Park 3 Staging": "832012938398400562",
		"Chess in the Park 3 Dev": "832012682520428625",
		"Chess in the Park 3 QA": "832012894068801636",
		"Cheers in the Park": "832013003968348200",
		"Watch YouTube Dev": "880218832743055411",
		"iframe-playground": "880559245471408169",
		"Doodle Crew Dev": "878067427668275241",
		"Letter Tile Dev": "879863753519292467",
		"Word Snacks Dev": "879864010126786570",
		"Fake Artist Dev": "879864104980979792",
		"Awkword Dev": "879863923543785532",
		"Decoders Dev": "891001866073296967",
		"SpellCast Staging": "893449443918086174"
	},
	NO_NAME: {
		"Discord Game 10": "832013108234289153",
		"Discord Game 11": "832025061657280566",
		"Discord Game 12": "832025114077298718",
		"Discord Game 13": "832025144389533716",
		"Discord Game 14": "832025179659960360",
		"Discord Game 15": "832025219526033439",
		"Discord Game 16": "832025249335738428",
		"Discord Game 17": "832025333930524692",
		"Discord Game 18": "832025385159622656",
		"Discord Game 19": "832025431280320532",
		"Discord Game 20": "832025470685937707",
		"Discord Game 21": "832025799590281238",
		"Discord Game 22": "832025857525678142",
		"Discord Game 23": "832025886030168105",
		"Discord Game 24": "832025928938946590",
		"Discord Game 25": "832025993019260929"
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

	patch() {
		inject("powercord-together-ids", Activities.__proto__, "getEnabledAppIds", () => {
			return [
				...Object.values(DATA_MINED_GAMES.STABLE),
				...(this.settings.get("showDev", false) ? Object.values(DATA_MINED_GAMES.DEV) : []),
				...(this.settings.get("showUnnamed", false) ? Object.values(DATA_MINED_GAMES.NO_NAME) : [])
			];
		});

		inject("powercord-together-rocket", Activities.__proto__, "isActivitiesEnabled", () => {
			return true;
		});
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings("powercord-together");
		uninject("powercord-together-rocket");
		uninject("powercord-together-ids");
	}
};
