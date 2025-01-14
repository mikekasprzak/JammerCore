import { Component } from 'preact';
import './common-body-avatar.less';

import {Button, Image, Icon} from 'com/ui';

import $Node from 'backend/js/node/node';
import $Asset from 'backend/js/asset/asset';

export default class ContentCommonBodyAvatar extends Component {
	constructor( props ) {
		super(props);

		this.onEdit = this.onEdit.bind(this);
	}

//	shouldComponentUpdate( nextProps ) {
//		return Shallow.Diff(this.props.children, nextProps.children);
//	}

	onEdit( e ) {
		let {node, user} = this.props;

		if ( !user || !user.id )
			return null;

		if ( e.target.files && e.target.files.length ) {
			var file = e.target.files[0];

			return $Asset.Upload(user.id, file)
				.then( r => {
					if ( r.path ) {
						var Avatar = '///content/'+r.path;

						if ( this.props.onchange ) {
							this.props.onchange(Avatar);
						}

						return $Node.AddMeta(node.id, {'avatar': Avatar});
					}
					else {
						alert(r.message);
					}
				})
				.catch(err => {
					this.setState({'error': err});
				});
		}
	}
	render( props ) {
		const isInProfile = props.node && (props.node.type === "user" && props.href === props.node.path);
		const isInteractive = (isInProfile && props.editing) || (!isInProfile && !props.editing);
		const Classes = `body -avatar ${props.class ?? ''} ${isInProfile && props.editing ? '-editing' : ''} ${isInteractive ? '-interactive' : ''}`;

		let AvatarFail = '///content/internal/user64.png';
		let Avatar = props.src ? props.src : AvatarFail;
		const name = props.node && props.node.name || "User";
		Avatar += ".64x64.fit.png";
		if (isInteractive) {
			return isInProfile && props.editing ?
				(<label>
					<input type="file" name="asset" style="display: none;" onChange={this.onEdit} />
					<div class={Classes}>
						<Image src={Avatar} srcError={AvatarFail} />
						<Icon src="edit" />
					</div>
				</label>) :
				(<Button class={Classes} href={props.href}>
					<Image alt={name + "'s avatar image"} src={Avatar} srcError={AvatarFail} />
				</Button>);
		}
		return (<span class={Classes}>
					<Image alt={name + "'s avatar image"} src={Avatar} srcError={AvatarFail} />
				</span>);
	}
}
