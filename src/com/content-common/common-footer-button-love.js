import {Component} from 'preact';
import './common-footer-button.less';
import './common-footer-button-love.less';

import UIIcon 							from 'com/ui/icon';
import $NodeLove						from 'shrub/js/node/node_love';

export default class ContentCommonFooterButtonLove extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'loved': null,
			'lovecount': null
		};

		this.onLove = this.onLove.bind(this);
	}

	componentDidMount() {
		// TODO: Extract Love from the global love pool (props.node.id)

		if ( this.props.user && this.props.user.id ) {
			$NodeLove.GetMy(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': r });
			});
		}
	}

	onLove( e ) {
		if ( this.state.loved ) {
			$NodeLove.Remove(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': false, 'lovecount': r.love.count });
			});
		}
		else {
			$NodeLove.Add(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': true, 'lovecount': r.love.count });
			});
		}
	}

	render( {node}, {loved, lovecount} ) {
		const Love = Number.isInteger(lovecount) ? lovecount : node.love;
		let LoveClass = '';
		if ( Love >= 10 )
			LoveClass = '-count-10';
		else if ( Love >= 4 )
			LoveClass = '-count-4';
		else if ( Love >= 1 )
			LoveClass = '-count-1';

		const Classes = `content-common-footer-button -love ${loved ? "loved" : ''} ${LoveClass}`;

		return (
			<div class={Classes} onClick={this.onLove}>
				<UIIcon class="-hover-hide">heart</UIIcon>
				<UIIcon class="-hover-show -loved-hide">heart-plus</UIIcon>
				<UIIcon class="-hover-show -loved-show">heart-minus</UIIcon>
				<div class="-count">{Love}</div>
			</div>
		);
	}
}
