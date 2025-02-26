import * as assert from 'assert';

import { RGBHexStringFromHSV } from '../lib/hsv-color';

suite('RGBHexStringFromHSV Basic Tests', () => {

	test('Basic test' ,() =>
	{
		[
			{ hsv: { h:210 , s:0.17 , v:0.8 } , expects: "a9bacc"  },
			{ hsv: { h:44 , s:1 , v:0.94 } , expects: "efaf00"  }
		].forEach( (t) =>
		{
			const RGB = RGBHexStringFromHSV( t.hsv.h , t.hsv.s ,t.hsv.v );
			assert.equal( RGB, t.expects , `expect: ${t.expects}`);
		});
	});
});