import * as vscode from "vscode";

import { 
	getActiveTextEditorForTabGroup,
	findMatchesInEditor,
	buildUriUnderMedia
} from './utils';


export class HighlightObject extends vscode.TreeItem
{
	private editorRangesMap: Map<vscode.TextEditor,vscode.Range[]> = new Map();
	private decoration: vscode.TextEditorDecorationType;
	readonly regex: RegExp;

	readonly regexString: string;

	constructor(
		{
			word,
			regex,
			decorationBuilder,
			collapsibleState,
		}:
		{
			word: string;
			regex: RegExp;
			decorationBuilder: ()=> vscode.DecorationRenderOptions;
			collapsibleState: vscode.TreeItemCollapsibleState;
		}
	)
	{
		// setup as TreeItem
		super( word , collapsibleState );
		this.contextValue = 'ThisIsHighlightObject';
		this.description = regex.toString();
		// this.command = {
		// 	command: 'tettekete.remove-highlight-with-regex',
		// 	title: "remove this",
		// 	arguments: [ regex.toString() ]
		// };
		this.iconPath = buildUriUnderMedia('panel-icon.svg');

		// setup as HighlightObject
		this.regex = regex;
		this.regexString = regex.toString();
		this.decoration = vscode.window.createTextEditorDecorationType( decorationBuilder() );
	}


	update( editors?: vscode.TextEditor[] )
	{
		if( ! editors )
		{
			editors = this._findAllActiveTextEditors();
		}

		editors.forEach((editor)=>
		{
			const rangeList = findMatchesInEditor( editor , this.regex );
			editor.setDecorations( this.decoration , rangeList );
			this.editorRangesMap.set( editor , rangeList );
		});
	}


	hasIntersectingRange( editor:vscode.TextEditor ,ranges: vscode.Range[] ): boolean
	{
		const thisRanges = this.editorRangesMap.get( editor );

		if( ! thisRanges )
		{
			return false;
		}

		for( const thisRange of thisRanges )
		{
			const found = ranges.find((range) =>
			{
				return !! range.intersection( thisRange );
			});

			if( found )
			{
				return true;
			}
		}

		return false;
	}

	getEditorsRanges( editor:vscode.TextEditor ):vscode.Range[] | undefined
	{
		return this.editorRangesMap.get( editor );
	}


	dispose()
	{
		this.decoration.dispose();
		this.editorRangesMap.clear();
	}


	private _findAllActiveTextEditors()
	{
		const result: vscode.TextEditor[] = [];

		vscode.window.tabGroups.all.forEach((tagGroup)=>
			{
				const viewColumn = tagGroup.activeTab?.group.viewColumn;
				if( viewColumn === undefined ){ return; }

				const activeEditor = getActiveTextEditorForTabGroup( viewColumn );
				if( activeEditor === undefined ){ return; }

				result.push( activeEditor );
			}
		);

		return result;
	}
}