import React, {useEffect, useState} from 'react';

function Timer({seconds, onFinish}) {
	//remaining tracks the remaining time on the timer
	const [remaining, setRemaining] = useState(seconds);
	//trigger tracks the expiration of the timer
	const [trigger, setTrigger] = useState(false);

	/* Sets up and breaks down the timer tick rate in browser */
	useEffect( () => {
		let timerID = setInterval(() => tick(), 1000);
		return () => clearInterval(timerID);
	});

	/* Updates the state of remaining and trigger */
	const tick = () => {
		if (remaining -1 >= 0 && !trigger) {
			setRemaining(remaining - 1);
		} else if (!trigger) {
			setTrigger(true);
			onFinish();
			setRemaining(remaining + 1);
		} else {
			setRemaining(remaining + 1);
		}
	}

	return (
		<p>
			{trigger ? `${remaining} seconds late` : `${remaining} seconds left`}
		</p>
	);
}

export default function App() {
	const name = 'world';
	return (<Timer seconds='30' onFinish={() => alert('done')}/>);
}