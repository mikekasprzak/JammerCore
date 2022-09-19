import { h, Component } from 'preact/preact';
import UIIcon 			from 'com/ui/icon';

export default class ContentPicture extends Component {
	render( props, state ) {
		props.title = (props.post && props.post.title) ? props.post.title : props.title;
		props.user = props.user ? props.user : {};

		var hasTwitter = props.user.twitter ? <span class="-twitter"> (<UIIcon>twitter</UIIcon> {props.user.twitter})</span> : <span />;
		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <UIIcon>users</UIIcon></span> : <span />;

		return (
			<div class="content content-picture" style={'background:url('+props.img+')'}>
				<div class="-header">
					<div class="-avatar"><img src={props.user.avatar ? "//"+STATIC_DOMAIN+props.user.avatar : ""} /></div>
					<div class="-title _font2">{props.title}</div>
					<div class="-subtext">
						Posted <span class="-time">{props.relative_time}</span> ago
						on <span class="-title" title={props.date}>{props.short_date}</span>,
						by <span class="-name">{props.user.name}</span>
						{hasTwitter}
						{hasTeam}
					</div>
				</div>
				<div class="-space">
					<UIIcon>image</UIIcon>
				</div>
				<div class="-footer">
				</div>
			</div>
		);
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}
}
