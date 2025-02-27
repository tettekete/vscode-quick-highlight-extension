
import { RGBHexStringFromHSV } from './hsv-color';

const kDefaultHue = 42;
let index = 0;
let hue = kDefaultHue;
let hueStep = 130;

export function getHighlightColor( prefix:string = '')
{
	const beforeHue = hue;	// for debug log
	let offsetCoefficient = Math.floor( index / (360 / hueStep) );

	hue = kDefaultHue + hueStep * index + offsetCoefficient * 31;
	while( hue > 360) { hue -= 360; }

	const info = {index , beforeHue , hueStep , hue, offsetCoefficient};
	// process.stderr.write( JSON.stringify(  info, undefined,2 ));

	index ++;
	index %= Number.MAX_SAFE_INTEGER;

	return prefix + RGBHexStringFromHSV( hue,1.0 ,0.94 );
}

export function getComplementaryColorForText()
{
	const textHue = hue + 180;

	return '#' + RGBHexStringFromHSV( textHue , 1.0 , 0.94 );
}