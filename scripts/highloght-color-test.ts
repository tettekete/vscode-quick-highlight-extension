
import { getHighlightColor } from '../src/lib/highlight-color';


const html_head=`
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Color Sample</title>
</head>
<body>
`;

const html_foot=`
</body>
`;

(()=>
{
	process.stdout.write( html_head );

	let count = 0;
	for(let i=0;i<30;i++)
	{
		const color = getHighlightColor("#");

		let colorSampleHtml = `
		<div style="display: flex;">
			<div style="width: 2rem">${i}</div>
			<div style="background-color: ${color}; width: 3rem;"></div>
		</div>
		`;

		process.stdout.write( colorSampleHtml );
	}

	process.stdout.write( html_foot );
})();
