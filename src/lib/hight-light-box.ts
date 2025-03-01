import * as vscode from 'vscode';

const defaultRenderOptions:vscode.DecorationRenderOptions =
{
	backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
};

export class HightLightBox
{
	static #textEditorDecoration:vscode.TextEditorDecorationType | undefined;
	static #displayEditor: vscode.TextEditor | undefined;
	static #showTime: number = 0;
	static #eventBlockDuration: number = 0;
	static #renderOptionBase: vscode.DecorationRenderOptions = defaultRenderOptions;


	// A setter method for #textEditorDecoration to ensure proper disposal.
	private static _setTextEditorDecoration( decoration: vscode.TextEditorDecorationType ):vscode.TextEditorDecorationType
	{
		HightLightBox.dispose();
		HightLightBox.#textEditorDecoration = decoration;
		return HightLightBox.#textEditorDecoration;
	}


	// A setter method for #renderOptionBase
	static setRenderOptionBase( decoration: vscode.DecorationRenderOptions )
	{
		HightLightBox.#renderOptionBase = decoration;
	}


	static getRenderOptions( isWholeLine: boolean )
	{
		return {
			...HightLightBox.#renderOptionBase,
			isWholeLine
		};
	}


	static dispose()
	{
		if( HightLightBox.#textEditorDecoration )
		{
			HightLightBox.#textEditorDecoration.dispose();
		}

		HightLightBox.#displayEditor = undefined;
		HightLightBox.#showTime = 0;
	}


	static disposeIfSameEditor( editor:vscode.TextEditor )
	{
		if( editor === HightLightBox.#displayEditor )
		{
			HightLightBox.dispose();
		}
	}

	
	static disposeByEvent( editor?: vscode.TextEditor )
	{
		editor ??= vscode.window.activeTextEditor;
		if( ! editor )
		{
			return;
		}

		const HB = HightLightBox;
		if( Date.now() - HB.#showTime > HB.#eventBlockDuration )
		{
			HB.disposeIfSameEditor( editor );
		}
	}


	static show(
		{
			editor
			,range
			,eventBlockDuration = 0
			,autoPartialLine = true
		}:
		{
			editor?: vscode.TextEditor;
			range: vscode.Range;
			eventBlockDuration?: number;
			autoPartialLine?: boolean;
		}
	)
	{
		HightLightBox.dispose();

		// validation
		editor ??= vscode.window.activeTextEditor;
		if( ! editor )
		{
			return;
		}

		let isWholeLine = true;
		if( autoPartialLine )
		{
			if( range.start.line === range.end.line )
			{
				isWholeLine = false;
			}
		}

		HightLightBox.#eventBlockDuration = eventBlockDuration * 1000;

		// display process
		HightLightBox._showHightLightBox(
			{
				editor,
				range,
				isWholeLine
			}
		);
	}


	private static _showHightLightBox(
		{
			editor,
			range,
			isWholeLine
		}:
		{
			editor: vscode.TextEditor;
			range: vscode.Range;
			isWholeLine: boolean;
		}
	)
	{
		const highlightBox = vscode.window.createTextEditorDecorationType(
			HightLightBox.getRenderOptions( isWholeLine )
		);

		HightLightBox._setDecorations( editor , range , highlightBox );
	}


	private static _setDecorations(
		editor: vscode.TextEditor
		,range: vscode.Range
		,decoration: vscode.TextEditorDecorationType
	)
	{
		editor.setDecorations(
			HightLightBox._setTextEditorDecoration( decoration )
			,[range]
		);

		HightLightBox.#displayEditor = editor;
		HightLightBox.#showTime = Date.now();
	}
}
