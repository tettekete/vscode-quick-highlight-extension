
import { RGBHexStringFromHSV } from './hsv-color';

const kDefaultHue = 42;
let index = 0;
let hue = kDefaultHue;
let hueStep = 130;

export function getHighlightColor( prefix:string = '')
{
	hue = hue + hueStep * index;
	index ++;
	index %= Number.MAX_SAFE_INTEGER;

	return prefix + RGBHexStringFromHSV( hue,1.0 ,0.94 );
}