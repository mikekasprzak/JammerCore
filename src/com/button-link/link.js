import NavLink 			from 'com/nav-link/link';
import './link.less';

/** @deprecated use \{UIButton} (or \{UIButtonLink}) from "com/ui" */
export default class ButtonLink extends NavLink {
	constructor( props ) {
		super(props);
	}

	render(props) {
		if ( props.class )
			props.class = "button-base button-link " + props.class;
		else
			props.class = "button-base button-link";
		if ( props.disabled )
			props.class += " -disabled";

		let doHistory;
		if ( props.href ) {
			if ( props.href.indexOf('//') !== -1 ) {
				props.target = "_blank";
				props.rel = "noopener noreferrer";
			}
//			else if ( props.replace ) {
//				doHistory = this.onClickReplace.bind(this);
//				delete props.replace;
//			}
			else {
				doHistory = this.onClick;//Push.bind(this);
			}
		}

		// Wrap onClick with a function that deselects current element //
		let onClickFunc = props.onClick;
		props.onClick = (e) => {
			if ( props.disabled ) {
				return;
			}

			if ( onClickFunc ) {
				onClickFunc(e);
			}

			if ( doHistory ) {
				doHistory.call(this.base, e);
			}

			if ( typeof document.activeElement.blur !== "undefined" ) {
				document.activeElement.blur();
			}
			// SVG Elements on Internet Explorer have no blur() method, so call the parent's blur //
			else if ( document.activeElement.parentNode.blur ) {
				document.activeElement.parentNode.blur();
			}
		};

		props.onKeyDown = (e) => {
			if ( e.keyCode === 13 && !props.disabled ) {
				props.onClick();
			}
		};

		return (
			<a {...props} />
		);
	}
}
