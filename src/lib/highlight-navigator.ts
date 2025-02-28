import * as vscode from 'vscode';

import { HighlightStore } from './highlight-store';

export class HighlightNavigator
{
	static lastEditor:WeakRef<vscode.TextEditor> | undefined = undefined;
	static lastRegexString: string | undefined = undefined;
	static lastIndx: number | undefined = undefined;

	static gotoNext(
		{
			editor,
			regexString
		}:
		{
			editor?:vscode.TextEditor;
			regexString?: string;
		} = {}
	)
	{
		HighlightNavigator.goto({
			direction: 1,
			editor,
			regexString,
		});
	}


	static gotoPrevious(
		{
			editor,
			regexString,
		}:
		{
			editor?:vscode.TextEditor;
			regexString?: string;
		} = {}
	)
	{
		HighlightNavigator.goto({
			direction: -1,
			editor,
			regexString,
		});
	}

	
	private static goto(
		{
			direction,
			editor,
			regexString,
		}:
		{
			direction: 1 | -1
			editor?:vscode.TextEditor;
			regexString?: string;
		}
	)
	{
		let range: vscode.Range | undefined = undefined;
		const cls = HighlightNavigator;
		editor ??= vscode.window.activeTextEditor;
		if(! editor )
		{
			return;
		}

		if(! regexString )
		{
			const r = HighlightStore.getRegexAndWordFromEditor( editor );
			regexString	= r.regex.toString();
			range		= r.range;
		}

		const hObj = HighlightStore.instance().getHighlightForRegex( regexString );
		if( hObj === undefined ){ return; }

		const ranges = hObj.getEditorsRanges( editor );
		if( ranges === undefined ){ return; }

		if( ! range && ! editor.selection.isEmpty )
		{
			range = new vscode.Range( editor.selection.start , editor.selection.end );
		}

		let rangeIdx = 0;
		let rangeNotFound = true;
		if( range !== undefined )
		{
			let i		= 0;
			let found	= false;
			for(const theRange of ranges )
			{
				if( theRange.isEqual( range ) )
				{
					rangeIdx = i + direction;
					rangeNotFound = false;
					break;
				}

				i ++;
			}
		}

		if( rangeNotFound )
		{
			if( cls.lastEditor?.deref() === editor
			&& cls.lastRegexString === regexString )
			{
				if( cls.lastIndx === undefined )
				{
					cls.lastIndx = 0;
				}
				else
				{
					rangeIdx = cls.lastIndx + direction;
				}
			}
		}

		rangeIdx %= ranges.length;
		while( rangeIdx < 0 )
		{
			rangeIdx = ranges.length + rangeIdx;
		}

		editor.revealRange( ranges[rangeIdx] ,vscode.TextEditorRevealType.InCenter );
		editor.selection = new vscode.Selection( ranges[rangeIdx].start , ranges[rangeIdx].end);

		cls.lastEditor = new WeakRef( editor );
		cls.lastRegexString = regexString;
		cls.lastIndx = rangeIdx;
	}
}
