import {Component, toChildArray} from 'preact';
import './common-body-by.less';

import {Diff} from 'shallow';
import {getLocaleDate, getRoughAge}	from 'internal/time';
import {Link, Tooltip} from 'com/ui';

export default class ContentCommonBodyBy extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return Diff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

	getName( node ) {
		if ( node.meta['real-name'] )
			return node.meta['real-name'];
		return node.name;
	}

	getAtName( node ) {
		return node.slug;
	}

	getURL( node ) {
		return '/users/'+node.slug;
	}

	getWhen( node, label ) {
		if ( node.published ) {
			var date_pub = new Date(node.published);
			if ( node.meta['origin-date'] ) {
				date_pub = new Date(node.meta['origin-date']);
			}
			var date_now = new Date();
			var pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);

			// x minutes ago
			return <span>{label} <Tooltip text={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</Tooltip></span>;
		}
		else {
			return <span>not {label} yet</span>;
		}
	}
	getModified( node, label ) {
		let date_pub = new Date(node.modified);
		let date_now = new Date();
		let pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);

		// x minutes ago
		return <span>{label} <Tooltip text={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</Tooltip></span>;
	}

	render( props ) {
		let ret = [];
		if ( !props.noby ) {
			// Prefix that goes before `by`
			if ( props.by && (typeof props.by == 'string') ) {
				ret.push(<span>{props.by} </span>);
			}
			ret.push(<span>by </span>);

			// Author names
			if ( props.authors ) {
				for ( var idx = 0; idx < props.authors.length; idx++ ) {
					ret.push(<span class="-name">{this.getName(props.authors[idx])}</span>);
					ret.push(" ");
					ret.push(
						<span>
							(<Link class="-at-name" href={this.getURL(props.authors[idx])}>@{this.getAtName(props.authors[idx])}</Link>)
							{((props.authors.length > 1) && (props.authors[idx].id == props.node.author)) ? <Tooltip text="Team Leader">*</Tooltip> : ''}
						</span>
					);
					if ( idx < props.authors.length-2 )
						ret.push(<span>, </span>);
					else if ( idx < props.authors.length-1 )
						ret.push(<span>, and </span>);
				}
			}
			else if ( props.author ) {
				ret.push(<span class="-name">{this.getName(props.author)}</span>);
				ret.push(" ");
				ret.push(<span>(<Link class="-at-name" href={this.getURL(props.author)}>@{this.getAtName(props.author)}</Link>)</span>);
			}
		}

		if ( props.when && props.node ) {
			ret.push(<span class="-when">{ret.length ? ", " : ''}{this.getWhen(props.node, props.label)}</span>);
		}
		else if ( props.modified && props.node ) {
			ret.push(<span class="-when">{ret.length ? ", " : ''}{this.getModified(props.node, props.label)}</span>);
		}

		return (
			<div class={`body -by ${props.class ?? ''}`}>
				{ret}
				{props.children}
			</div>
		);
	}
}
