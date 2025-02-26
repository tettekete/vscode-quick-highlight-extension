

export function RGBHexStringFromHSV( h:number , s:number ,v:number ):string
{
	const { r,g,b } = RGBFromHSV( h,s,v );

	let rgbHexString = '';
	[r,g,b].forEach( (ratio) =>
	{
		const hexStr = ratioToHex(ratio);
		rgbHexString += hexStr;
	} );

	return rgbHexString;
}

function RGBFromHSV( h:number , s:number ,v:number )
:{
	r: number;
	g: number;
	b: number
}
{
	let r:number = 0;
	let g:number = 0;
	let b:number = 0;

	if(s < 0){s = 0.0;}
	if(v < 0){v = 0.0;}
	if(s > 1){s = 1.0;}
	if(v > 1){v = 1.0;}
	
	while(h < 0 ){ h += 360; };
	while(h >= 360){ h -= 360; };
	
	if( s === 0 )
	{
		r = g = b = v;
	}
	
	const Hi = Math.floor(h/60);
	const f = (h/60) - Hi;
	
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	
	if( Hi === 0)
	{
		r = v;
		g = t;
		b = p;
	}
	else if(Hi === 1)
	{
		r = q;
		g = v;
		b = p;
	}
	else if(Hi === 2)
	{
		r = p;
		g = v;
		b = t;
	}
	else if(Hi === 3)
	{
		r = p;
		g = q;
		b = v;
	}
	else if(Hi === 4)
	{
		r = t;
		g = p;
		b = v;
	}
	else if(Hi === 5)
	{
		r = v;
		g = p;
		b = q;
	}

	return { r,g,b };
}

function ratioToHex( ratio: number )
{
	let tmp = "00" + Math.floor( ratio * 0xff ).toString(16);

	return tmp.substring(tmp.length-2);
}