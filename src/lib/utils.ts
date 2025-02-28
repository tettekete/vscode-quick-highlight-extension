import * as vscode from 'vscode';

import { VSCContext } from './vsc-context';

export function escapeRegexMeta(str: string): string
{
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export function findMatchesInEditor(
	editor: vscode.TextEditor
	,regex: RegExp
): vscode.Range[]
{
	const text = editor.document.getText();
	const ranges: vscode.Range[] = [];
	let match;

	while( (match = regex.exec(text)) !== null )
	{
		const startPos = editor.document.positionAt(match.index);
		const endPos = editor.document.positionAt(match.index + match[0].length);
		const range = new vscode.Range(startPos, endPos);
		ranges.push(range);
	}

	return ranges;
}

/**
 * Returns the vscode.TextEditor object active in the specified tagGroup = viewColumn.
 *
 * Returns undefined if not found.
 *
 * @export
 * @param {vscode.ViewColumn} viewColumn 
 * @returns {(vscode.TextEditor | undefined)} 
 */
export function getActiveTextEditorForTabGroup( viewColumn: vscode.ViewColumn ): vscode.TextEditor | undefined
{
	// Get the active tab of the target tag group = ViewColumn
	let targetTab:vscode.Tab | undefined;
	for(const tagGroup of vscode.window.tabGroups.all )
	{
		if( tagGroup.viewColumn === viewColumn )
		{
			targetTab = tagGroup.activeTab;
			break;
		}
	}

	if( targetTab === undefined )
	{
		// Basically, it's impossible.
		return undefined;
	}

	let pathString: string | undefined = undefined;
	if( targetTab.input !== null
	 && typeof targetTab.input === 'object'
	 && 'uri' in targetTab.input )
	{
		pathString = (targetTab.input as {uri: vscode.Uri }).uri.toString();
	}

	if( pathString === undefined )
	{
		return undefined;
	}
	
	return findTextEditorWithViewColumnAndPathString( viewColumn , pathString );
	
}


/**
 * Returns a vscode.TextEditor object matching viewColumn and pathString =
 * uri.toString().
 * 
 * If not found, returns undefined.
 *
 * @param {vscode.ViewColumn} viewColumn 
 * @param {string} pathString 
 * @returns {(vscode.TextEditor | undefined)} 
 */
function findTextEditorWithViewColumnAndPathString(
	viewColumn: vscode.ViewColumn,
	pathString: string
):vscode.TextEditor | undefined
{
	const foundEditor = vscode.window.visibleTextEditors.find((textEditor: vscode.TextEditor ) =>
	{
		return textEditor.viewColumn === viewColumn
		&& textEditor.document.uri.toString() === pathString;
	});

	return foundEditor;
}


/**
 * 全てのタググループのアクティブタブから URI の一致する TextEditor のリストを返す。
 *
 * @export
 * @param {vscode.Uri} uri 
 * @returns {vscode.TextEditor[]} 
 */
export function findActiveEditorsByUri( uri: vscode.Uri ):vscode.TextEditor[]
{
	const uriString = uri.toString();
	const activeTabs = vscode.window.tabGroups.all
		.map((group) =>
		{
			return {
            	tab: group.activeTab,
            	viewColumn: group.viewColumn
        	};
		})
		.filter((tabInfo) => 
		{
			return tabInfo.tab
					&& typeof tabInfo.tab.input === 'object'
					&& tabInfo.tab.input !== null
					&& 'uri' in tabInfo.tab.input
					&& (tabInfo.tab.input as {uri: vscode.Uri}).uri.toString() === uriString;
		});

	
	const editors = vscode.window.visibleTextEditors
		.filter((editor) =>
		{
			return !! activeTabs.find((tab) =>
				{
					return editor.viewColumn === tab.viewColumn
						&& editor.document.uri.toString() === uriString;
				}
			);
		});

	return editors;
}


export function findAllActiveTextEditors()
{
	const editorList: vscode.TextEditor[] = [];

	vscode.window.tabGroups.all.forEach((tagGroup)=>
		{
			const viewColumn = tagGroup.activeTab?.group.viewColumn;
			if( viewColumn === undefined ){ return; }

			const activeEditor = getActiveTextEditorForTabGroup( viewColumn );
			if( activeEditor === undefined ){ return; }

			editorList.push( activeEditor );
		}
	);

	return editorList;
}


export function rangeDescription( range: vscode.Range )
{
	const startLine = range.start.line;
	const startPos	= range.start.character;
	const endLine	= range.end.line;
	const endPos	= range.end.character;

	return `line: ${startLine},${startPos} - ${endLine},${endPos}`;
}

export function getExpandedRange( range:vscode.Range , deltaChar: number = 1 )
{
	let expandedStart:vscode.Position;
	if( range.start.character - deltaChar < 0 )
	{
		expandedStart = new vscode.Position( range.start.line , 0 );
	}
	else
	{
		expandedStart = range.start.translate( undefined ,-deltaChar);
	}
	
	const expandedEnd	= range.end.translate( undefined ,deltaChar);
	return new vscode.Range( expandedStart , expandedEnd );
}

export function getExpandedLineRange( range: vscode.Range ,deltaLine: number = 1 )
{
	let expandedStart:vscode.Position;
	if( range.start.character - deltaLine < 0 )
	{
		expandedStart = new vscode.Position( 0 , 0 );
	}
	else
	{
		expandedStart = range.start.translate( -deltaLine );
	}

	const expandedEnd	= range.end.translate( deltaLine );

	return new vscode.Range( expandedStart , expandedEnd );
}

export function getTextFromEditorSelection( editor: vscode.TextEditor )
{
	const selectionRange = new vscode.Range( editor.selection.start ,editor.selection.end );
	return editor.document.getText( selectionRange );
}


export function buildUriUnderMedia(...args:string[]):vscode.Uri
{
	const mediaPath = VSCContext.extensionContext().extensionUri;
	return	vscode.Uri.joinPath(
							mediaPath,
							"media",
							...args
						);
}
