import { Component } from 'preact';
import './tooltip.less';

import {Icon, Button} from 'com/ui';
import ContentCommonBody				from 'com/content-common/common-body';


export default class ToolTip extends Component {
	constructor( props ) {
		super(props);

		// MK: THIS IS BAD
		if (!props.maxWidth) {
			props.maxWidth = 0.5;
		}
		if (!props.horizontalPadding) {
			props.horizontalPadding = 6;
		}
		if (!props.hideDelay) {
			props.hideDelay = 500;
		}
		if (!props.touchNoDoubleClick) {
			props.touchNoDoubleClick = 0.1;
		}

		this.state = {
			'showPopUp': false,
		};

		this.delayHideCounter = 0;
		this.lastToggle = 0;
		this.tooltipDiv = null;
		this.tooltipContainerDiv = null;
	}

	toggleShow(evt) {
		const state = this.state;
		const t = evt.timeStamp;
		if (t - this.lastToggle < this.props.touchNoDoubleClick) {
			return;
		}
		this.lastToggle = t;

		if (state.showPopUp) {
			this.delayHideCounter++;
			this.setState({'showPopUp': false});
		}
		else {
			this.showNow();
		}
	}

	showNow() {
		this.delayHideCounter++;
		this.setState({'showPopUp': true});
	}

	delayHide() {
		if (this.props.permaOn === true) {
			return;
		}
		this.delayHideCounter++;
		const myHide = this.delayHideCounter;

		setTimeout(
			() => ((this.delayHideCounter == myHide) ? this.setState({'showPopUp': false}) : null),
			this.props.hideDelay
		);
	}

	render (props, state) {
		let popUp = null;
		if (state.showPopUp && props.PopUpContent) {
			popUp = (<div onMouseOver={() => this.showNow()} onMouseOut={() => this.delayHide()} class="-tooltip" ref={(div) => (this.tooltipDiv = div)}>{props.PopUpContent}</div>);
		}
		else {
			this.tooltipDiv	= null;
		}

		let ToolTipButtonContent = null;
		if (props.ToolTipButtonContent) {
			ToolTipButtonContent = props.ToolTipButtonContent;
		}
		else {
			ToolTipButtonContent = <Icon class="-small -baseline -gap" src="info" />;

		}

		return (
			<div class="tooltip-container" ref={(div) => (this.tooltipContainerDiv = div)}>
			{popUp}
			<Button	class="-button -tooltip-icon" onClick={(evt) => this.toggleShow(evt)} hoverCallback={ (hover) => hover ? this.showNow() : this.delayHide() } >{ToolTipButtonContent}</Button>
			</div>
		);
	}

	componentDidUpdate() {
		this.reshapeIfNeeded();
		this.alignTooltipHorizontallyIfNeeded();
	}

	reshapeIfNeeded() {
	}

	alignTooltipHorizontallyIfNeeded() {
		const props = this.props;
		const docWidth = document.documentElement.clientWidth;
		const maxWidth = docWidth * props.maxWidth;
		const minLeft = props.horizontalPadding;
		const maxRight = docWidth - props.horizontalPadding;

		if (this.tooltipDiv && this.state.showPopUp && this.tooltipContainerDiv) {
			const rect = this.tooltipDiv.getBoundingClientRect();
			const containerRect = this.tooltipContainerDiv.getBoundingClientRect();

			let width = rect.width;
			if (width > maxWidth) {
				this.tooltipDiv.style.maxWidth = maxWidth + 'px';
				width = maxWidth;
			}

			if (rect.x < minLeft) {

				this.tooltipDiv.style.left = (minLeft - containerRect.x) + 'px';
			}

			const right = rect.x + rect.width;
			if (right > maxRight) {
				const targetDeltaX = Math.floor(Math.max(props.horizontalPadding - containerRect.x, 0 - rect.width));
				this.tooltipDiv.style.left = targetDeltaX + 'px';
			}

		}

	}
}
