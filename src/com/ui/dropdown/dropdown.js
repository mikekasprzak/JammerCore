import { toChildArray } from 'preact';
import './dropdown.less';
const ui_dropdown = 'ui_dropdown';

import {Button} from '../button';
import {Icon} from '../icon';

// MK: I tried to add a click again to defocus the dropdown, but it didn't work
function defocus( e ) {
	if (e.target === document.activeElement) {
		e.target.blur();
	}
}

// 'tick' is a little up/down arrow that appears on the right side of the button
export function Dropdown( props ) {
	const {children, showTick, leftAlign, rightAlign, 'class': classProp, ...otherProps} = props;
	const firstChild = toChildArray(children).slice(0, 1);
	const otherChildren = toChildArray(children).slice(1);
	return <form {...otherProps} class={`${ui_dropdown} ${classProp ?? ''} ${leftAlign ? '-left' : ''} ${rightAlign ? '-right' : ''}`}>
		<Button /*onClick={defocus}*/>
			{firstChild}
			{showTick ? <><Icon class="ui_tick up" src="tick-up" /><Icon class="ui_tick down" src="tick-down" /></> : null}
		</Button>
		{otherChildren}
	</form>;
}

/*
export class UIDropdown2 extends Component {

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
		let myButton = toChildArray(props.children).slice(0, 1);

		// MK: I don't like how this uses children. Previously it was using '.attribute' directly. It shouldn't need it
		let ShowContent = null;
		if ( state.show ) {
			let that = this;
			let Children = toChildArray(props.children).slice(1);

			let Content = [];
			for ( let idx = 0; idx < Children.length; idx++ ) {
				if ( Children[idx].props.onClick ) {
					Content.push(cloneElement(Children[idx], {
						'onClick': (e) => {
							that.doHide();
							Children[idx].props.onClick(e);
						}
					}));
				}
				else if ( Children[idx].props.href ) {
					Content.push(cloneElement(Children[idx], {
						'onClick': function(e) {
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
				<div class="-click-catcher" onClick={this.doHide} />
			];
		}

		// The little tick symbol along the right side
		let ShowTick = null;
		if ( props.tick ) {
			if ( ShowContent )
				ShowTick = <Icon src="tick-up" class="-tick" />;
			else
				ShowTick = <Icon src="tick-down" class="-tick" />;
		}

		let Classes = [
			'ui-dropdown',
			props.class,
			ShowContent ? '-show' : '',
			props.left ? '-left' : '',
			props.right ? '-right' : ''
		].join(' ');

		return (
			<div class={Classes} ref={(div) => (this.dropdown = div)}>
				<Button class="-button" onClick={this.onButton}>{ShowTick}{myButton}</Button>
				{ShowContent}
			</div>
		);
	}
}
*/
