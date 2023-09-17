import { Component } from 'preact';
import Sanitize from 'internal/sanitize';

// TODO: Push the state (arg1 of pushShate/replaceState (MK: what?)
// MK TODO: give this file a serious look. tidy up

export const navigationEvent = 'navChange';

function navigateToHref( e ) {
	// Bail if we're trying to open link in a new window using a modifer+click shortcut
	if ( e.shiftKey || e.metaKey || e.ctrlKey || e.altKey ) {
		return;
	}

	// If it's a local link, prevent the browser from navigating
	let newURL = new URL(e.target.href, window.location.href);
	if (newURL.origin === window.location.origin) {
		e.preventDefault();

		// Merge the query parameters
		const mergedSearch = new URLSearchParams({
			...Object.fromEntries(new URLSearchParams(window.location.search)),
			...Object.fromEntries(new URLSearchParams(newURL.search))
		});

		newURL.search = mergedSearch.toString();

		//window.location.assign(newURL.href);
		window.dispatchEvent(new CustomEvent(navigationEvent, {'detail': newURL.toString()}));

		//e.stopPropagation();	// Do we need this?
	}
}

/**
 * @callback PushstateCallback
 * @param {any} newURL
 * @returns {any} newState
 * */

/**
 * @callback PopstateCallback
 * @param {any} newState
 * */

/**
 * @param {PushstateCallback} [pushstateCallback]
 * @param {PopstateCallback} [popstateCallback]
 * */
export function setupNavigation( pushstateCallback, popstateCallback ) {
	window.addEventListener(navigationEvent, /** @param {CustomEvent} e */ (e) => {
		DEBUG && console.log(`[${navigationEvent}]:`, window.location.href, '=>', e.detail);
		history.pushState(pushstateCallback?.(e.detail), null, e.detail);
	});

	window.addEventListener('popstate', (e) => {
		DEBUG && console.log("popstate: ", e.state);
		popstateCallback?.(e.state);
	});
}


export function Link( props ) {
	const {rel, target, href, ...otherProps} = props;

	// MK: URL() will throw if invalid. In theory this replaces the need for my sanitization code.
	try {
		//const sanitizedHref = href ? Sanitize.sanitize_URI(href) : '';
		const sanitizedURL = new URL(href ?? '', window.location.href);
		const isExternal = sanitizedURL.origin !== window.location.origin;
		const newTarget = isExternal ? "_blank" : target;
		const newRel = isExternal ? `noopener noreferrer ${rel ?? ''}` : undefined;

		// MK NOTE: We aren't handling spacebar, when this is used as a button.
		return <a {...otherProps} rel={newRel} target={newTarget} href={href} onClick={navigateToHref} />;
	}
	catch (e) {
		console.error(`Bad href: ${href}\n`, e.message);
		return <a />;
	}
}

/*
export class Link extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
		//this.dispatchNavChangeEvent = this.dispatchNavChangeEvent.bind(this);
	}

/*
	dispatchNavChangeEvent( navState ) {
		window.dispatchEvent(new CustomEvent('navchange', {
			'detail': {
				...new URL(this.props.href, window.location.href),
			    ...navState
			}
		}));

		/*
		console.log("DISZZZBPATH", this);
		// MK: Is this legal?
		let base = this.base;

		// MK: No it isn't. Base isn't guarenteed to be set. Reference URL should be checked another way.
		// use this.props.href

		let _href = base.href + ((base.search && base.search.length !== 0) ? "" : navState.old.search);
		let _search = (base.search && base.search.length !== 0) ? base.search : navState.old.search;

		let new_event = new CustomEvent('navchange', {
			'detail': Object.assign(navState, {
				'location': {
					'baseURI': base.baseURI,		// without query string
					'hash': base.hash,				// #hash
					'host': base.host,				// host with port
					'hostname': base.hostname,		// without port
					'href': _href,					// full
					'origin': base.origin,			// protocol+host
					'pathname': base.pathname,		// just the path
					'port': base.port,				// port
					'protocol': base.protocol,		// http:, https:, etc
					'search': _search,				// query string
				}
			})
		});

		window.dispatchEvent(new_event);

	}
*/
/*
	onClick( e ) {
		// Bail if we're trying to open link in a new window using a modifer+click shortcut
		if ( e.shiftKey || e.metaKey || e.ctrlKey || e.altKey )
			return;

		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
		if ( origin === window.location.origin ) {
			// Stop the page from reloading after the click
			e.preventDefault();

			let newURL = new URL(this.props.href, window.location.href);
			newURL.hash = newURL.hash ? newURL.hash : window.location.hash;

			// Append window's query string
			for (let [key, value] of new URLSearchParams(window.location.search).entries()) {
				newURL.searchParams.append(key, value);
			}

			// Trigger a 'navchange' event to cleanup what we've done here
			window.dispatchEvent(new CustomEvent('navchange', {
				'detail': {
					'location': newURL,
					'old': {...window.location},
					'top': window.pageYOffset || document.documentElement.scrollTop,
					'left': window.pageXOffset || document.documentElement.scrollLeft,
				}
			}));

			//this.dispatchNavChangeEvent(navState);
		}

		e.stopPropagation();
	}


	render( props ) {
		if ( props.href ) {
			props = {...props};

			props.href = Sanitize.sanitize_URI(props.href);

			// Is this an external link?
			if ( props.href.indexOf('//') !== -1 ) {
				// Open in a new window
				props.target = "_blank";
				// Tell browser to discard opener (new window) and referrer (link) details
				props.rel = "noopener noreferrer";
			}
			// If not, it's an internal link
			else {
				// If not blank, set onClick event
				if ( !props.blank ) {
					props.onClick = this.onClick;
				}
				// Open in a new window
				else {
					props.target = "_blank";
				}
			}

			// Return a link
			return <a {...props} class={`ui-link ${props.class ?? ''}`} />;
		}

		// Return a span
		return <span {...props} class={`ui-link ${props.class ?? ''}`} />;
	}
}
*/
