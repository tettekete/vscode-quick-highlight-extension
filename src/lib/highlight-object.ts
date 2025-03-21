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
		this.description = this.makeTreeItemDescription( regexString );

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


	hasEqualRange( editor: vscode.TextEditor ,range: vscode.Range ): boolean
	{
		const ranges = this.editorRangesMap.get( editor );

		if( ! ranges )
		{
			return false;
		}

		for(const theRange of ranges )
		{
			if( theRange.isEqual( range ) )
			{
				return true;
			}
		}
		return false;
	}


	hasRangeContainingPosition( editor: vscode.TextEditor , pos: vscode.Position ): boolean
	{
		const ranges = this.editorRangesMap.get( editor );

		if( ! ranges )
		{
			return false;
		}

		for(const theRange of ranges )
		{
			if( theRange.contains( pos ) )
			{
				return true;
			}
		}
		return false;
	}

	findRangeInEditorPosition( editor: vscode.TextEditor ,pos: vscode.Position )
	:vscode.Range | undefined
	{
		const ranges = this.editorRangesMap.get( editor );

		if( ! ranges )
		{
			return undefined;
		}

		for( const range of ranges )
		{
			if( range.contains( pos ) )
			{
				return range;
			}
		}

		return undefined;
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

	private makeTreeItemDescription( regexString:string ): string
	{
		let boundaryInfo = 'As a mere search term';
		if( regexString.includes('(?<=^|\\W)') )
		{
			boundaryInfo = 'As a standalone word';
		}

		const regexOption = /([^\/]+)$/.exec( regexString );
		let caseSensitiveInfo = 'Case-Sensitive match';
		if( regexOption )
		{
			if( /i/.test( regexOption[1] ) )
			{
				caseSensitiveInfo = 'Case-Insensitive match';
			}
		}

		return `${boundaryInfo} / ${caseSensitiveInfo}`;
	}
}
