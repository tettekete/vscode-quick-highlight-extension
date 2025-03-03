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
import { VSCConfig } from './lib/vsc-config';


export function activate(context: vscode.ExtensionContext)
{
	VSCContext.setExtensionContext( context );

	HightLightBox.setRenderOptionBase({
		textDecoration: 'underline',
		fontWeight: 'bold',
		outline: '0.25rem double',
		outlineColor: new vscode.ThemeColor('focusBorder'),
	});

	vscode.commands.executeCommand('setContext', 'isSelectionHighlighted' , false );
	vscode.commands.executeCommand('setContext', 'hasSelection' , false );

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

	// toggle config CaseInsensitive setting
	const toggleCaseSensitiveSetting = vscode.commands.registerCommand(
		'tettekete.toggle-config-case-sensitive'
		,async () =>
		{
			const caseInsensitive = await VSCConfig.toggleCaseInsensitive();

			let message = 'Quick Highlight is now Case-Sensitive.';
			if( caseInsensitive )
			{
				message = 'Quick Highlight is now Case-Insensitive.';
			}

			vscode.window.setStatusBarMessage( message , 5000);
		}
	);

	// toggle config AutomaticWordBoundaryHandling setting
	const toggleAutomaticWordBoundaryHandling =  vscode.commands.registerCommand(
		'tettekete.toggle-config-automatic-word-boundary-handling'
		,async () =>
		{
			const AWBD = await VSCConfig.toggleAutomaticWordBoundaryHandling();

			let onOff = 'OFF';
			if( AWBD )
			{
				onOff = 'ON';
			}

			let message = `Quick Highlight: Word Boundary Handling is now ${onOff}.`;

			vscode.window.setStatusBarMessage( message , 5000);
		}
	);

	const docsChangeListener = vscode.workspace.onDidChangeTextDocument(
		(event) =>
		{
			const changes = event.contentChanges;
			const doc = event.document;

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
			updateSelectionHighlightFlag( event.textEditor );
			vscode.commands.executeCommand(
				'setContext',
				'hasSelection' ,
				! event.textEditor.selection.isEmpty
			);
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
		toggleCaseSensitiveSetting,
		toggleAutomaticWordBoundaryHandling,
		treeView
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function updateSelectionHighlightFlag( editor: vscode.TextEditor )
{
	// const range = new vscode.Range( editor.selection.start , editor.selection.end );
	
	let isSelectionHighlighted = false;

	if( editor.selection.isEmpty )
	{
		isSelectionHighlighted = HighlightStore.instance().existsHighlightAtEditorPosition(
			editor,
			editor.selection.active
		);
	}
	else
	{
		const range = editor.selection.with();
		isSelectionHighlighted = HighlightStore.instance().existsHighlightInEditorRange(
			editor,
			range
		);
	}
	
	vscode.commands.executeCommand(
		'setContext',
		'isSelectionHighlighted',
		isSelectionHighlighted
	);
}
