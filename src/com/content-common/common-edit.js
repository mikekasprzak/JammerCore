import './common-edit.less';

import {Button, Icon} from 'com/ui';


export default function ContentCommonEdit( props ) {
	var ShowEdit = null;
	var ShowPreview = null;
	var ShowSave = null;
	var ShowPublish = null;

	if ( props.editing ) {
		ShowEdit = <Button class="-selected"><Icon src="edit" /><div class="if-sidebar-block">Edit</div></Button>;
		ShowPreview = <Button onClick={props.onpreview}><Icon src="preview" /><div class="if-sidebar-block">Preview</div></Button>;
	}
	else {
		ShowEdit = <Button onClick={props.onedit}><Icon src="edit" /><div class="if-sidebar-block">Edit</div></Button>;
		ShowPreview = <Button class="-selected"><Icon src="preview" /><div class="if-sidebar-block">Preview</div></Button>;
	}

	if ( props.modified ) {
		ShowSave = <Button class="-available -save" onClick={props.onsave}><Icon src="save" /><div class="if-sidebar-block">Save</div></Button>;
	}
	else {
		ShowSave = <Button><Icon src="save" /><div class="if-sidebar-block">Saved</div></Button>;
	}

	if ( !props.nopublish ) {
		if ( !props.published ) {
			ShowPublish = <Button class="-available -publish" onClick={props.onpublish}><Icon src="publish" /><div class="if-sidebar-block">Publish</div></Button>;
		}
		else {
			ShowPublish = <Button class="-available -publish" onClick={props.ondone}><Icon src="checkmark" /><div class="if-sidebar-block">Done</div></Button>;
		}
		// Otherwise, published is null, so publish button is not shown
	}

	return (
		<div class="body -edit">
			<div class="-right">
				{ShowSave}
				{ShowPublish}
			</div>
			<div class="-left">
				{ShowPreview}
				{ShowEdit}
			</div>
		</div>
	);
}
