const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class Settings extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<SwitchItem
					onChange={() => {
						this.props.toggleSetting("showDev");
					}}
					note={"Enables all dev branch of the games Discord has to offer."}
					value={this.props.getSetting("showDev", false)}
				>
					Enable dev games
				</SwitchItem>

				<SwitchItem
					onChange={() => {
						this.props.toggleSetting("showDisabled");
					}}
					note={"Enables all the disabled games Discord has to offer."}
					value={this.props.getSetting("showDisabled", false)}
				>
					Enable disabled games
				</SwitchItem>
			</div>
		);
	}
};
