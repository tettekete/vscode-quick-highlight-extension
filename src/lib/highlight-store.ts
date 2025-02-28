import * as vscode from 'vscode';

import { HighlightObject } from './highlight-object';
import {
	escapeRegexMeta,
	getExpandedRange,
	getExpandedLineRange
} from './utils';
import { VSCConfig } from './vsc-config';


interface HighlightRecord
{
	highlight: HighlightObject;
	word: string;
}

export class HighlightStore implements vscode.TreeDataProvider<HighlightObject>
{
	private _onDidChangeTreeData: vscode.EventEmitter<HighlightObject | undefined> = new vscode.EventEmitter<HighlightObject | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<HighlightObject | undefined> = this._onDidChangeTreeData.event;

	static #instance: HighlightStore;
	private regexHighlightMap: Map<string,HighlightRecord> = new Map();

	static instance()
	{
		if( ! HighlightStore.#instance )
		{
			HighlightStore.#instance = new HighlightStore();
		}

		return HighlightStore.#instance;
	}

	addHighlight(
		{
			regex,
			decorationBuilder,
			word
		}:
		{
			regex: RegExp;
			decorationBuilder: ()=> vscode.DecorationRenderOptions;
			word: string;
		}
	)
	{
		const regexKey = regex.toString();

		if( this.has( regexKey ) )
		{
			return;
		}

		const highlight = new HighlightObject({
			word,
			regex,
			decorationBuilder,
			collapsibleState: vscode.TreeItemCollapsibleState.None
		});

		this.regexHighlightMap.set(
			regexKey,
			{
				highlight,
				word
			}
		);

		highlight.update();

		this.updateTreeView();
	}

	has( regex: string | RegExp )
	{
		const regexKey = regex instanceof RegExp ? regex.toString() :regex;

		return this.regexHighlightMap.has( regexKey );
	}

	getHighlightForRegex( regex: RegExp | string ): HighlightObject | undefined
	{
		const regexKey	= regex instanceof RegExp ? regex.toString() :regex;
		const record	= this.regexHighlightMap.get( regexKey );
		if( record )
		{
			return record.highlight;
		}

		return undefined;
	}

	removeHighlightWithRegex( regex: RegExp | string )
	{
		const regexKey	= regex instanceof RegExp ? regex.toString() :regex;
		const record	= this.regexHighlightMap.get( regexKey );

		if( record )
		{
			record.highlight.dispose();
			this.regexHighlightMap.delete( regexKey );
			this.updateTreeView();
		}
	}


	clearAll()
	{
		for( const rec of this.regexHighlightMap.values() )
		{
			rec.highlight.dispose();
		}

		this.regexHighlightMap.clear();
		this.updateTreeView();
	}


	updateWithEditorRange( editor:vscode.TextEditor , eventRanges:vscode.Range[] ):boolean
	{
		for( const rec of this.regexHighlightMap.values() )
		{
			if( rec.highlight.hasIntersectingRange( editor ,eventRanges ) )
			{
				rec.highlight.update( [editor] );
				return true;
			}
		}

		return false;
	}


	updateWithRegex( editor: vscode.TextEditor , eventRanges: vscode.Range[] ):boolean
	{
		let updated = false;
		for( const rec of this.regexHighlightMap.values() )
		{
			for(const eventRange of eventRanges )
			{
				const expandedRange = getExpandedLineRange( eventRange );
				const text = editor.document.getText( expandedRange );

				if( rec.highlight.regex.test( text ) )
				{
					rec.highlight.update();
					updated = true;
					break;
				}
			}
		}

		return updated;
	}

	// vscode.TreeDataProvider interface
	getTreeItem(element: HighlightObject): vscode.TreeItem
	{
		return element;
	}

	getChildren(element?: HighlightObject): Thenable<HighlightObject[]>
	{
		const itemList:HighlightObject[] = [...this.regexHighlightMap.values()].map((item) => item.highlight );
		return Promise.resolve( itemList );
	}

	updateTreeView()
	{
		this._onDidChangeTreeData.fire( undefined );
	}


	static getRegexAndWordFromEditor( editor: vscode.TextEditor ):{word:string , regex: RegExp ,range: vscode.Range }
	{
		const selectionRange = new vscode.Range( editor.selection.start ,editor.selection.end );
		const word = editor.document.getText( selectionRange );
		const escapedWord = escapeRegexMeta( word );
	
		let regexSource:string = escapedWord;

		if( VSCConfig.automaticWordBoundaryHandling() )
		{
			const expandedWordRange = getExpandedRange( selectionRange );
			const expandedWord = editor.document.getText( expandedWordRange );

			let wordBoundaryCheckRegex = /^\W.+\W$/;
			if( word.length + 2 !== expandedWord.length )
			{
				if( selectionRange.start.character === 0 )
				{
					wordBoundaryCheckRegex = /\W$/;
				}
				else
				{
					wordBoundaryCheckRegex = /^\W/;
				}
			}
			
			if( wordBoundaryCheckRegex.test( expandedWord ) )
			{
				regexSource = `\\b${escapedWord}\\b`;
			}
		}

		let option = 'g';
		if( VSCConfig.caseInsensitive() )
		{
			option += 'i';
		}

		return {
			word,
			regex: RegExp( regexSource ,option ),
			range: selectionRange
		};
	}
}