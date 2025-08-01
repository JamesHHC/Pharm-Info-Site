const CrownIcon = ({w, h}) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={w} height={h} fill="url(#goldGradient)" viewBox="0 0 576 512">
		<defs>
			<linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor="#FCCA57" />
				<stop offset="100%" stopColor="#FFAF56" />
			</linearGradient>
		</defs>
		{/* !Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
		<path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"/>
		<text x="288" y="425" fontSize="180" textAnchor="middle" fill="#FED59C" className="noselect">
	    	VIP
	  	</text>
	</svg>
);

export default CrownIcon;

