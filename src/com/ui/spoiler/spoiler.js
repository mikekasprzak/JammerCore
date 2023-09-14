import { Component } from 'preact';
import './spoiler.less';

export default class UISpoiler extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'visible': false
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		this.setState({'visible': true});
	}

	render( props, state ) {
		return (
			<blockquote class={`ui-spoiler ${state.visible ? '-visible' : ''}`} onClick={this.onClick}>
				{props.children}
			</blockquote>
		);
	}
}