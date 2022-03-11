import {h, Component, cloneElement, toChildArray}		from 'preact/preact';
import UIButton							from 'com/ui/button/button';
import UIIcon							from 'com/ui/icon/icon';

export default class UIDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': !!props.show,
		};

		this.onButton = this.onButton.bind(this);

		this.doShow = this.doShow.bind(this);
		this.doHide = this.doHide.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
	}
	doHide( e ) {
		this.setState({'show': false});
	}

	// Clicking on the button
	onButton( e ) {
		this.setState(prevState => ({'show': !prevState.show}));
	}

	render( props, state ) {
		let Button = toChildArray(props.children).slice(0, 1);

		// MK: I don't like how this uses children. Previously it was using '.attribute' directly. It shouldn't need it
		let ShowContent = null;
		if ( state.show ) {
			let that = this;
			let Children = toChildArray(props.children).slice(1);

			let Content = [];
			for ( let idx = 0; idx < Children.length; idx++ ) {
				if ( Children[idx].props.onclick ) {
					Content.push(cloneElement(Children[idx], {
						'onclick': (e) => {
							that.doHide();
							Children[idx].props.onclick(e);
						}
					}));
				}
				else if ( Children[idx].props.href ) {
					Content.push(cloneElement(Children[idx], {
						'onclick': function(e) {
							that.doHide();
						}
					}));
				}
				else {
					Content.push(cloneElement(Children[idx]));
				}
			}

			ShowContent = [
				<div class="-content">
					{Content}
				</div>,
				<div class="-click-catcher" onclick={this.doHide} />
			];
		}

		// The little tick symbol along the right side
		let ShowTick = null;
		if ( props.tick ) {
			if ( ShowContent )
				ShowTick = <UIIcon src="tick-up" class="-tick" />;
			else
				ShowTick = <UIIcon src="tick-down" class="-tick" />;
		}

		let Classes = cN(
			'ui-dropdown',
			props.class,
			ShowContent ? '-show' : null,
			props.left ? '-left' : null,
			props.right ? '-right' : null
		);

		return (
			<div class={Classes} ref={(input) => { this.dropdown = input; }}>
				<UIButton class="-button" onclick={this.onButton}>{ShowTick}{Button}</UIButton>
				{ShowContent}
			</div>
		);
	}
}
