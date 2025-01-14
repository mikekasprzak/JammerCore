import {Component} from 'preact';
import './common-footer-button.less';

import {Icon} from 'com/ui';

export default class ContentCommonFooterButtonMinMax extends Component {
	constructor( props ) {
		super(props);
	}

	render( {onClick} ) {
		if ( !onClick )
			onClick = function(){};

		return (
			<div class="content-common-footer-button -minmax" onClick={onClick}>
				<Icon class="_inline-if-not-minimized" src="arrow-up" />
				<Icon class="_inline-if-minimized" src="arrow-down" />
			</div>
		);
	}
}
