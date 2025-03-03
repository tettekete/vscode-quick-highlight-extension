
import * as vscode from 'vscode';

export class VSCConfig
{
	static #config = vscode.workspace.getConfiguration();


	// - - - - - - - - - - - - - - - - - - - -
	// borderOnly<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static borderOnly( fallback?: boolean ): boolean
	{
		const config = VSCConfig._booleanConfig(
			'quick-highlight.borderOnly'
		);

		if( config === undefined )
		{
			return !! fallback;
		}
	
		return config;
		
	}

	// - - - - - - - - - - - - - - - - - - - -
	// caseInsensitive<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static caseInsensitive( fallback?: boolean ): boolean
	{
		const config = VSCConfig._booleanConfig(
			'quick-highlight.caseInsensitive'
		);

		if( config === undefined )
		{
			return !! fallback;
		}

		return config;
	}

	static async toggleCaseInsensitive(): Promise<boolean>
	{
		return await VSCConfig._toggleConfig( 'quick-highlight.caseInsensitive' );
	}

	// - - - - - - - - - - - - - - - - - - - -
	// automaticWordBoundaryHandling<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static automaticWordBoundaryHandling( fallback: boolean = true): boolean
	{
		const config = VSCConfig._booleanConfig(
			'quick-highlight.automaticWordBoundaryHandling'
		);

		if( config === undefined )
		{
			return !! fallback;
		}

		return config;
	}

	static async toggleAutomaticWordBoundaryHandling(): Promise<boolean>
	{
		return await VSCConfig._toggleConfig( 'quick-highlight.automaticWordBoundaryHandling' );
	}


	static _stringConfig( configName: string , fallback?: string ):string | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<string>( configName );
		
		if( value === undefined && typeof fallback === 'string' )
		{
			return fallback;
		}

		return value;
	}

	static _numberConfig( configName: string , fallback?:number ):number | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<number>( configName );
		
		if( value === undefined && typeof fallback === 'number' )
		{
			return fallback;
		}
		return value;
	}

	static _booleanConfig( configName: string , fallback?:boolean ):boolean | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		if( value  === undefined && typeof fallback === 'boolean' )
		{
			return fallback;
		}
		return value;
	}

	static async _toggleConfig( configName: string ): Promise<boolean>
	{
		const value = !! vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		await vscode.workspace.getConfiguration().update(
			configName,
			! value,
			vscode.ConfigurationTarget.Global
		);

		return !! vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
	}
}