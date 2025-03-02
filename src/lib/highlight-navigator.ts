import * as vscode from 'vscode';

import { HighlightStore } from './highlight-store';
import { HightLightBox } from './hight-light-box';
import { dir } from 'console';

export class HighlightNavigator
{
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
			// create regexString and range from activeTextEditor.
			if( editor.selection.isEmpty )
			{
				const r = HighlightStore.instance().findHighlightAtEditorPosition(
					editor
				);
				if( r )
				{
					regexString = r.highlight.regexString;
					range = r.range;
				}
				else
				{
					// regexString が定まらないと言うことは探すべき Highlight が定まらないということ
					// If the regexString is not fixed, it means that the Highlight to be searched for is not fixed.
					return;
				}
			}
			else
			{
				const r = HighlightStore.getRegexAndWordFromEditor( editor );
				regexString	= r.regex.toString();
				range		= r.range;
			}
		}

		const hObj = HighlightStore.instance().getHighlightForRegex( regexString );
		if( hObj === undefined ){ return; }

		const ranges = hObj.getEditorsRanges( editor );
		if( ranges === undefined ){ return; }

		if( ! range )
		{
			if( ! editor.selection.isEmpty )
			{
				range = new vscode.Range( editor.selection.start , editor.selection.end );
			}
		}

		let rangeIdx = 0;
		let rangeNotFound = true;
		if( range === undefined )
		{
			rangeIdx = findNearestRangeIndexFromPos( direction , editor.selection.active ,ranges );
			rangeNotFound = false;
		}
		else
		{
			let i		= 0;
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
			rangeIdx = findNearestRangeIndexFromPos( direction , editor.selection.active ,ranges );
		}

		rangeIdx %= ranges.length;
		while( rangeIdx < 0 )
		{
			rangeIdx = ranges.length + rangeIdx;
		}

		editor.revealRange( ranges[rangeIdx] ,vscode.TextEditorRevealType.Default );
		editor.selection = new vscode.Selection( ranges[rangeIdx].start , ranges[rangeIdx].end);

		HightLightBox.show(
			{
				editor,
				range: ranges[rangeIdx],
				eventBlockDuration: 0.3
			}
		);
	}
}


function findNearestRangeIndexFromPos(
	direction: 1 | -1,
	pos: vscode.Position,
	ranges: vscode.Range[]
): number
{
	if( ranges[0].start.isAfter( pos ) )
	{
		return 0;
	}
	else if( ranges[ranges.length-1].start.isBefore( pos ))
	{
		return 0;
	}

	for(let i=0;i<ranges.length -1 ;i++ )
	{
		if( ranges[i].contains( pos ) )
		{
			return i + direction;
		}
		else if( ranges[i+1].contains( pos ) )
		{
			return i + 1 + direction;
		}

		const p1 = ranges[i].end;
		const p2 = ranges[i+1].start;
		if( p1.isBefore( pos ) && p2.isAfter(pos) )
		{
			if( direction > 0 )
			{
				return i + 1;
			}
			else
			{
				return i;
			}
			
		}
	}

	return 0;
}
