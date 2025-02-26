
import * as vscode from 'vscode';

import { VSCConfig } from './lib/vsc-config';
import { HighlightStore } from './lib/highlight-store';
import { getHighlightColor } from './lib/highlight-color';

export function toggleWordHighlight()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor ){ return; }
	if( editor.selection.isEmpty ){ return; }

	const { word , regex } = HighlightStore.getRegexAndWordFromEditor( editor );

	const store = HighlightStore.instance();

	const highlightOrUndefined = store.getHighlightForRegex( regex );
	if( highlightOrUndefined !== undefined )
	{
		store.removeHighlightWithRegex( regex );
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
				opacity: "0.5",
				borderRadius: "0.2rem"
			};
	}

}
