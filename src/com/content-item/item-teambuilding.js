import { Component } from 'preact';
import './item-teambuilding.less';

import { node_IsAuthor } from 'internal/lib';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentLoading					from 'com/content-loading/loading';
import {Button, Icon, Tooltip, Dropdown} from 'com/ui';

import $Node							from 'backend/js/node/node';

export default class ItemTeambuilding extends Component {
	constructor(props) {
		super(props);
		this.state = {'friends': [], 'processing': false};
		this.removeFromTeam = this.removeFromTeam.bind(this);
		this.addToTeam = this.addToTeam.bind(this);
	}

	componentDidMount() {
		this.loadFriends();
	}

	removeFromTeam(userId) {
		const {featured, node, onChange} = this.props;
		this.setState({'processing': userId});
		$Node.RemoveLink(node.id, userId, {'author': null})
		.then(() => {
			this.setState({
				'processing': false,
				'error': null,
			});
			onChange(userId, -1);
		})
		.catch( err => {
			this.setState({
				'error': `Requesting removing user ${userId} caused ${err}`,
				'processing': false,
			});
		});
	}

	addToTeam(userId) {
		const {featured, node, onChange} = this.props;
		this.setState({'processing': userId});
		$Node.AddLink(node.id, userId, {'author': null})
		.then(() => {
			this.setState({'processing': false});
			onChange(userId, 1);
		})
		.catch( err => {
			this.setState({'error': err, 'processing': false});
		});
	}

	loadFriends() {
		$Node.GetMy()
		.then(r => {
			if ( r.meta.star && r.meta.star.length && r.refs.star && r.refs.star.length ) {
				$Node.Get(r.meta.star.filter(id => r.refs.star.indexOf(id) > -1))
				.then(r => {
					this.setState({'friends': r.node});
				})
				.catch(e => this.setState({'error': `Error fetching friends ${e}`}));
			}
		})
		.catch(e => this.setState({'error': `Error getting friends-list ${e}`}));
	}

	renderUser(user, me, mainAuthor) {
		const isMe = user.id === me;
		const isMain = user.id === mainAuthor;
		const canBeRemoved = (isMe && !isMain) || (!isMe && mainAuthor === me);
		return (
			<li class="team-list-member">
				<Icon class="-baseline -small" src="user" />
				<strong>{user.name}</strong>
				{isMe && ' (you)'}
				{isMain && <Tooltip text="Primary Author">*</Tooltip>}
				{canBeRemoved && <Button class="team-member-remove" onClick={() => this.removeFromTeam(user.id)} tooltip="Remove from team"><Icon src="cross" /></Button>}
			</li>
		);
	}

	renderAddUser(friend) {
		const friendId = friend.id;
		return (
			<Button onClick={() => this.addToTeam(friendId)} key={friend.id} tooltip={`Click to add ${friend.name}`}>
				<Icon src="user" /><span>{friend.name}</span>
			</Button>
		);
	}

	renderAdder(authors) {
		const {friends} = this.state;
		if (!friends)
			return;
		const authorIds = authors.map(author => author.id);
		const Addable = [
			<div class="team-list-add-header">Add to team<Icon src="arrow-down" /></div>
		].concat(friends
			.filter(friend => authorIds.indexOf(friend.id) === -1)
			.sort((a, b) => (a.name > b.name) ? 1 : -1)
			.map(friend => this.renderAddUser(friend))
		);
		if (Addable.length > 1) {
			return (
				<div class="team-list-add">
					<Dropdown>{Addable}</Dropdown>
				</div>
			);
		}
	}

	render(props, {processing, error}) {
		const {node, user, authors} = props;
		const ShowTeamBuilding = [];
		if (node.type != 'item') {
			return;
		}
		let includeBuilding = true;
		let includeAdding = node_IsAuthor(node, user) && !processing;

		if (node.subsubtype == 'compo') {
			if (authors.length < 2) {
				ShowTeamBuilding.push(<div class="-items">You are competing in the {node.subsubtype}. You cannot add others to your {node.subtype}</div>);
				ShowTeamBuilding.push(<div class="-footer"><Icon class="-small -baseline" src="info" /> You can change this if you select a different event</div>);
				includeBuilding = false;
			}
			else if (authors.length > 0) {
				ShowTeamBuilding.push(<div class="team-building-warning -items">You are competing in the {node.subsubtype}, but your {node.subsubtype} has multiple authors. Please change the event</div>);
				includeAdding = false;
			}
		}

		if (includeBuilding) {
			const Team = authors
				.sort((a, b) => (a.id === node.author && -1) || (b.id === node.author && 1) || (a.name > b.name ? 1 : -1))
				.map(author => this.renderUser(author, user.id, node.author));
			const Adder = includeAdding && this.renderAdder(authors);
			ShowTeamBuilding.push((
				<ul class="team-list -items">
					{Team}
					{Adder}
					{processing && <ContentLoading />}
				</ul>
			));
			//if (includeAdding && !Adder) {
				ShowTeamBuilding.push((
					<div class="-footer">
						<span>To add team members, you first need to add them as friends. Visit each-others user pages and click the
						<span class="_nowrap"><Icon class="-baseline -small" src="user-plus" /> <strong>Follow</strong></span> button to become friends.
						When you are done, return here and you can add them to your team.</span>
					</div>
				));

				// All your friends are already added to this game. Go team!
			//}
		}
		return (
			<ContentCommonBody class="team-building">
				<div class="-label">Author(s)</div>
				<div class="-body">
					{ShowTeamBuilding}
					{error && <div class="team-building-warning">{error}</div>}
				</div>
			</ContentCommonBody>
		);
	}
}
