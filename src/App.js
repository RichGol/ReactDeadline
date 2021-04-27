//https://nice-forest-0da45c110.azurestaticapps.net/
import React, { useEffect, useLayoutEffect, useState } from "react";

const createArray = length => [...Array(length)];

/***********************************
 * RENDERS THE MosaicBtn COMPONENT *
 ***********************************/
function MosaicBtn() {
	//setup statefulness for interaction, shape, text, and colors
	const [clicked, setClicked] = useState(false);
	const [radius, setRadius] = useState('0px');
	const [text, setText] = useState('#');
	const [color, setColor] = useState('0,0,0');
	const [bgColor, setBGColor] = useState('255,255,255');

	//randomize from default values on first render
	useLayoutEffect(() => {
		setRadius(genRadius());
		setText(genLetter());

		let textColor = genColor();
		let bgColor = genColor();
		while (!validateColors(textColor, bgColor)) {
			textColor = genColor();
			bgColor = genColor();
		}
		setColor(textColor);
		setBGColor(bgColor);
	}, []);

	//generate a random uppercase letter for text state
	const genLetter = () => {
		let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
		'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		let letterIndex = Math.round(Math.random()*(letters.length - 1));
		return letters[letterIndex];
	}

	//generate a css border-radius value of 0px or 50px for shape state
	const genRadius = () => {
		let radius = Math.round(Math.random())*50;
		return `${radius}px`;
	}

	//generate a random rgb(---) color for color and bgColor state
	const genColor = () => {
		let colorArray = Array(3).fill(0).map(
			x => x = Math.round(Math.random()*255)
		);
		return colorArray.toString();
	}

	//determine whether text and bg colors contrast well before setting state
	const validateColors = (text, bg) => {
		//converts RGB values to linear values in range [0, 1]
		let getColor = x => x / 255;

		//applies gamma correction to each color value
		let gammaCorrect = x => {
			if (x < 0.03928) {
				return x / 12.92;
			} else {
				let mod = (x + 0.055) / 1.055;
				return (mod**2.4);
			}
		}
		//convert RGB strings to arrays, call getColor() and gammaCorrect() on each
		let textColor = text.split(',').map(getColor).map(gammaCorrect);
		let bgColor = bg.split(',').map(getColor).map(gammaCorrect);
		
		//calculates the luminance of each color
		let calcLum = color => {
			return (color[0]*0.2126) + (color[1]*0.7152) + (color[2]*0.0722);
		}
		//transform gamma-corrected colors to luminance values
		let textLum = calcLum(textColor);
		let bgLum = calcLum(bgColor);

		//calculate contrast between the luminance values
		let score = (textLum > bgLum) ? (textLum + 0.05) / (bgLum + 0.05) : (bgLum + 0.05) / (textLum + 0.05);

		//compare contrast score against passing value, return result
		return (score > 3 ? true : false);
	}

	//renders a button element styled according to the component state
	return (
		<button 
			className='box'
			style={{
				backgroundColor: (clicked) ? 'yellow' : `rgb(${bgColor})`,
				color: (clicked) ? 'black' : `rgb(${color})`,
				borderRadius: (clicked) ? '50px' : radius
			}}
			onClick={() => setClicked(!clicked)}
		>
			{(clicked) ? ':)' : text}
		</button>
	);
}

/***********************************
 * RENDERS THE MosaicRow COMPONENT *
 ***********************************/
 function MosaicRow() {
	//render 12 MosaicBtn Components within a <div>
	return (
		<div>
			{createArray(12).map( (b, i) => (
				<MosaicBtn key={i} />
			))}
		</div>
	);
}

/******************************** 
 * RENDERS THE Mosaic COMPONENT *
 ********************************/
 function Mosaic() {
	//render 12 MosaicRow Components
	return (
		<>
			{createArray(12).map( (r, i) => (
				<MosaicRow key={i} />
			))}
		</>
	);
}

/*******************************
 * RENDERS THE COUNTDOWN TIMER *
 *******************************/
 function Clock({ onRefresh, secondCount }) {
	//setup statefulness for timer countdown
	const [time, setTime] = useState(secondCount);
	const [trigger, setTrigger] = useState(false);

	//make timer tick once every second
	useEffect(() => {
		let timerID = setInterval(() => tick(), 1000);
		return () => clearInterval(timerID);
	});

	//timer behavior for finishing countdown
	const tick = () => {
		if (time - 1 >= 0) {
			setTime(time - 1);
		} else if (!trigger) {
			setTime(secondCount);
			setTrigger(true);
		}
	}

	//randomize page on finishing countdown
	const refresh = () => {
		setTrigger(false);
		onRefresh();
	}

	//render the timer countdown
	return (
		<h1
			style={{
				color: (time <= 10) ? 'red' : 'black'
			}}
		>
			{(trigger) ? refresh() : `${time} seconds left`}
		</h1>
	);
}

/*********************************
 * RENDERS THE WHOLE APPLICATION *
 *********************************/
 export default function App() {
	//setup statefulness for updating the page
	const [updates, setUpdates] = useState(0);

	const refresh = () => setUpdates(updates + 1);
	
	//render the timer, mosaic, and randomize button
	return (
		<>
			<div>
				<button onClick={() => refresh()} >
					Randomize!
				</button>
				<Clock key={updates+1} onRefresh={refresh} secondCount={60}/>
			</div>
			<Mosaic key={updates} />
		</>
	);
}