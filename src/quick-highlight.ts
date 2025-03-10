
import * as vscode from 'vscode';

import { VSCConfig } from './lib/vsc-config';
import { HighlightStore } from './lib/highlight-store';
import {
	getHighlightColor,
	getComplementaryColorForText
} from './lib/highlight-color';

export function toggleWordHighlight()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor ){ return; }
	
	const store = HighlightStore.instance();
	if( editor.selection.isEmpty )
	{
		const r = store.findHighlightAtEditorPosition( editor );
		if( r )
		{
			store.removeHighlightWithRegex( r.highlight.regexString );
			vscode.commands.executeCommand('setContext', 'isSelectionHighlighted' , false );
			return;
		}

		return;
	}

	const { word , regex } = HighlightStore.getRegexAndWordFromEditor( editor );

	
	const highlightOrUndefined = store.getHighlightForRegex( regex );
	if( highlightOrUndefined !== undefined )
	{
		store.removeHighlightWithRegex( regex );
		vscode.commands.executeCommand('setContext', 'isSelectionHighlighted' , false );
		return;
	}
	else
	{
		store.addHighlight({
			word,
			regex,
			decorationBuilder
		});
	}
}

function decorationBuilder():vscode.DecorationRenderOptions
{
	const highlightColor = getHighlightColor('#');

	if( VSCConfig.borderOnly( false )! )
	{
		return {
				border: "solid",
				borderColor: highlightColor,
				borderRadius: "0.2rem"
			};
	}
	else
	{
		return {
				backgroundColor: highlightColor,
				borderRadius: "0.2rem",
				color: getComplementaryColorForText()
			};
	}

}
