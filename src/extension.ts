import * as vscode from 'vscode';

import { toggleWordHighlight } from './quick-highlight';
import {
	rangeDescription,
	findActiveEditorsByUri
} from './lib/utils';

import { HighlightStore } from './lib/highlight-store';
import { HighlightObject } from './lib/highlight-object';

import { VSCContext } from './lib/vsc-context';
import { HighlightNavigator } from './lib/highlight-navigator';
import { HightLightBox } from './lib/hight-light-box';


export function activate(context: vscode.ExtensionContext)
{
	VSCContext.setExtensionContext( context );

	HightLightBox.setRenderOptionBase({
		textDecoration: 'underline',
		fontWeight: 'bold'
	});

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
		,( highlightObject: HighlightObject )=>
		{
			HighlightStore.instance().removeHighlightWithRegex( highlightObject.regexString );
		}
	);

	const gotoNextHighlight  = vscode.commands.registerCommand(
		'tettekete.goto-next-highlight'
		,( highlightObject?: HighlightObject )=>
		{
			if( highlightObject instanceof HighlightObject )
			{
				HighlightNavigator.gotoNext({
					regexString:  highlightObject.regexString
				});
			}
			else
			{
				HighlightNavigator.gotoNext();
			}
		}
	);

	const gotoPreviousHighlight  = vscode.commands.registerCommand(
		'tettekete.goto-prev-highlight'
		,( highlightObject?: HighlightObject )=>
		{
			if( highlightObject instanceof HighlightObject )
			{
				HighlightNavigator.gotoPrevious({
					regexString:  highlightObject.regexString
				});
			}
			else
			{
				HighlightNavigator.gotoPrevious();
			}
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

	const activeEditorListener = vscode.window.onDidChangeActiveTextEditor( (editor)=>
		{
			if( editor )
			{
				HighlightStore.instance().updateWithEditor( editor );
			}
		}
	);

	const editorSelectionChangedListener = vscode.window.onDidChangeTextEditorSelection( ( event ) =>
		{
			HightLightBox.disposeByEvent( event.textEditor );
		}
		,null
		,context.subscriptions
	);


	const treeDataProvider = HighlightStore.instance();
    const treeView = vscode.window.createTreeView('quickHighlightView', { treeDataProvider });

	context.subscriptions.push( 
		toggleHighlightWord,
		removeAllHighlight,
		docsChangeListener,
		removeHighlightWithRegexString,
		gotoNextHighlight,
		gotoPreviousHighlight,
		activeEditorListener,
		editorSelectionChangedListener,
		treeView
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

