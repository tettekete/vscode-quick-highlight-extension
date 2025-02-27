import * as vscode from 'vscode';

import { toggleWordHighlight } from './quick-highlight';
import {
	rangeDescription,
	findActiveEditorsByUri
} from './lib/utils';

import { HighlightStore } from './lib/highlight-store';
import { VSCContext } from './lib/vsc-context';


export function activate(context: vscode.ExtensionContext)
{
	VSCContext.setExtensionContext( context );

	const toggleHighlightWord = vscode.commands.registerCommand(
		'tettekete.toggle-highlight-word'
		,toggleWordHighlight
	);

	const removeAllHighlight = vscode.commands.registerCommand(
		'tettekete.remove-all-highlight'
		,()=>
		{
			HighlightStore.instance().clearAll();
		}
	);

	const removeHighlightWithRegexString  = vscode.commands.registerCommand(
		'tettekete.remove-highlight-with-regex'
		,( regexString:string )=>
		{
			HighlightStore.instance().removeHighlightWithRegex( regexString );
		}
	);

	const docsChangeListener = vscode.workspace.onDidChangeTextDocument(
		(event) =>
		{
			const changes = event.contentChanges;
			const doc = event.document;

			changes.forEach(( change ) =>
			{
				console.debug(`Uri: ${doc.uri.toString()}`);
				console.debug(`change.text: ${change.text}`);
				console.debug(`change.range: ${rangeDescription(change.range)}`);
			});

			const editors = findActiveEditorsByUri( doc.uri );
			const ranges:vscode.Range[] = [];
			changes.forEach((change) =>
			{
				ranges.push( change.range );
			});
			
			const highlightStore = HighlightStore.instance();
			editors.forEach(( editor ) =>
			{
				const updated = highlightStore.updateWithEditorRange( editor ,ranges );
				if(! updated )
				{
					highlightStore.updateWithRegex( editor , ranges );
				}
			});
			
		}
	);

	const treeDataProvider = HighlightStore.instance();
    const treeView = vscode.window.createTreeView('quickHighlightView', { treeDataProvider });

	context.subscriptions.push( 
		toggleHighlightWord,
		removeAllHighlight,
		docsChangeListener,
		treeView
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

