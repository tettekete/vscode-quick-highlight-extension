import * as vscode from "vscode";

import { 
	getActiveTextEditorForTabGroup,
	findMatchesInEditor,
} from './utils';


export class HighlightObject
{
	private editorRangesMap: Map<vscode.TextEditor,vscode.Range[]> = new Map();
	private decoration: vscode.TextEditorDecorationType;
	readonly regex: RegExp;

	readonly regexString: string;

	constructor(
		{
			regex,
			decorationBuilder
		}:
		{
			regex: RegExp;
			decorationBuilder: ()=> vscode.DecorationRenderOptions;
		}
	)
	{
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