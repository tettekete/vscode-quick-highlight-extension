import * as vscode from "vscode";

import { 
	findAllActiveTextEditors,
	findMatchesInEditor,
	buildUriUnderMedia
} from './utils';

export class HighlightRootNode extends vscode.TreeItem
{
	constructor()
	{
		super( 'All Highlight' , vscode.TreeItemCollapsibleState.Expanded );
		this.contextValue = 'ThisIsHighlightRootNode';
		this.iconPath = buildUriUnderMedia('panel-icon.svg');
	}
}


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
		const regexString = regex.toString();
		this.contextValue = 'ThisIsHighlightObject';
		if( regex.toString().includes('\\b') )
		{
			this.description = 'As a standalone word';
		}
		else
		{
			this.description = 'As a mere search term';
		}
		this.command = {
			command: 'tettekete.goto-next-highlight',
			title: "Go to next highlight",
			arguments: [ this ]
		};
		// this.iconPath = new vscode.ThemeIcon('primitive-dot',new vscode.ThemeColor('foreground'));

		// setup as HighlightObject
		this.regex = regex;
		this.regexString = regexString;
		this.decoration = vscode.window.createTextEditorDecorationType( decorationBuilder() );
	}


	update( editors?: vscode.TextEditor[] )
	{
		if( ! editors )
		{
			editors = findAllActiveTextEditors();
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

}