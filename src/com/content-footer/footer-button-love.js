import { Component } from 'preact';
import './footer-button.less';
import './footer-button-comments.less';

import { Icon } from 'com/ui';

import $NodeLove						from 'backend/js/node/node_love';

export default class ContentFooterButtonLove extends Component {
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

	onLove() {
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
		var _class = "footer-button footer-button-love" + (loved ? " loved" : "");
		return (
			<div class={_class} onClick={this.onLove}>
				<Icon class="-hover-hide" src="heart" />
				<Icon class="-hover-show -loved-hide" src="heart-plus" />
				<Icon class="-hover-show -loved-show" src="heart-minus" />
				<div class="-count">{Number.isInteger(lovecount) ? lovecount : node.love}</div>
			</div>
		);
	}
}
