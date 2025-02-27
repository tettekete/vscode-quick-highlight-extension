import * as vscode from "vscode";

export class VSCContext
{
	static #extensionContext: vscode.ExtensionContext;
	static #editor: vscode.TextEditor;

	// - - - - - - - - - - - - - - - - - - - -
	// extensionContext<vscode.ExtensionContext>
	// - - - - - - - - - - - - - - - - - - - -
	static setExtensionContext( context:vscode.ExtensionContext )
	{
		VSCContext.#extensionContext = context;
	}

	static extensionContext():vscode.ExtensionContext
	{
		if( VSCContext.#extensionContext === undefined )
		{
			throw Error('ExtensionContext is not registered.');
		}
		return VSCContext.#extensionContext;
	}
	
	// - - - - - - - - - - - - - - - - - - - -
	// editor(activeTextEditor<vscode.TextEditor>)
	// - - - - - - - - - - - - - - - - - - - -
	static setEditor( editor:vscode.TextEditor )
	{
		VSCContext.#editor = editor;
	}

	static editor():vscode.TextEditor
	{
		if( VSCContext.#editor === undefined )
		{
			throw Error('editor is not registered.');
		}
		return VSCContext.#editor;
	}
}