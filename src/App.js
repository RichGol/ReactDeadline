/* https://lively-rock-0b79e3a10.azurestaticapps.net/ 
 *
 *=======Component Tree (as they appear below)=======
 * App
 * |-EntryPage
 * |-RenderApp
 *   |-AddTask
 *   |-Task
 *     |-RemoveTask
 *     |-Timer
 */
import React, { useEffect, useState, useRef, useReducer } from "react"

/* RENDERS THE REACT APP */
export default function App() {
	const [user, setUser] = useState('');
	if (user) {return <RenderApp user={user} />}
	return <EntryPage setUser={setUser} />;
}

/* RENDERS THE "LOGIN" PAGE */
function EntryPage({setUser}) {
	//user refers to the username form input element
	const user = useRef();

	//process the form submission
	const submit = async e => {
		//prevent default behavior
		e.preventDefault();

		//save username and clear input element
		const name = user.current.value;
		setUser(name);
		user.current.value = '';

		//save user to the database
		await fetch('http://127.0.0.1/add-user', {
			method: 'POST',
			mode: 'no-cors',
			body: JSON.stringify({user: name})
		});
	}

	return (
		<form onSubmit={submit}>
			<input ref={user} type='text' placeholder='username' required />
			<input type='submit' id='submit' value='Enter' />
		</form>
	);
}

/* RENDERS THE MAIN APP */
function RenderApp({user}) {
	//tasks stores an array of current tasks
	const [tasks, setTasks] = useState([]);
	//keyVal provides a unique key for each task
	const [keyVal, setKeyVal] = useState(0);

	//load three Task objects on first render
	useEffect( () => {
		const temp = [{
			text: 'task 1',
			time: '5/6/2021 10:30:00',
			key: 0,
			index: 0
		},{
			text: 'task 2',
			time: '5/6/2021 11:30:00',
			key: 1,
			index: 1
		},{
			text: 'task 3',
			time: '5/6/2021 12:30:00',
			key: 2,
			index: 2
		}];
		loadTasks(temp);
	}, []);

	//load tasks from a JSON object array
	const loadTasks = temp => {
		//load keyVal state, preventing overlap with new tasks
		const lastKey = temp[temp.length - 1].key;
		setKeyVal(lastKey + 1);

		//populate tasks array with loaded tasks
		temp.map( task => setTasks(allTasks => [...allTasks, task]));
	}

	//append a new task to the tasks array
	const addTask = async (text, time, key=keyVal, index=tasks.length) => {
		//create the new Task object
		const task = {
			text: text,
			time: time,
			key: key,
			index: index
		};

		//update the state of keyVal and tasks
		setKeyVal(keyVal + 1);
		setTasks(allTasks => [...allTasks, task]);

		//save task to the database under the user
		await fetch('http://127.0.0.1:80/add-task', {
			method: 'POST',
			mode: 'no-cors',
			body: JSON.stringify({user: user, tasks: text, timer: time})
		});
	}

	//remove a specified task from the tasks array
	const removeTask = index => {
		const newTasks = tasks.filter( task => !(task.index === index))
		.map( (task, i) => {
			if (task.index !== i) task.index = i;
			return task;
		});
		setTasks(newTasks);
	}

	return (
		<>
			<p>Welcome, {user}</p>
			<AddTask add={addTask} />
			{tasks.map( task => (
				<Task remove={removeTask} {...task} />
			))}
		</>
	)
}

/* RENDERS A FORM TO ADD TASKS */
function AddTask({add}) {
	//taskDesc references the description form input element
	const taskDesc = useRef();
	//taskExpir references the expiration form input element
	const taskExpir = useRef();

	//regex patterns restrict user input to match "MM/DD/YYYY hh:mm:ss AM"
	const regexPat = '(0?[1-9]|1[0-2])[/-](0?[1-9]|[12][0-9]|3[01])[/-]([0-9]{4})' + 
		' (0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])( [AaPp][Mm])?';
	
	//time and timeString prefills the expiration form input with today's date
	const time = new Date();
	const timeString = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} `;

	//process the form submission
	const submit = e => {
		//prevent default behavior
		e.preventDefault();

		//add the task
		const desc = taskDesc.current.value;
		const expir = taskExpir.current.value;
		add(desc, expir);

		//reset form values
		taskDesc.current.value = '';
		taskExpir.current.value = timeString;
		taskDesc.current.focus();
	}

	return (
		<form onSubmit={submit}>
			<p>Task:</p>
			<input ref={taskDesc} type='text' placeholder='task name' required />
			<p>Expires: </p>
			<input ref={taskExpir} type='text' placeholder='date/time' pattern={regexPat}
				defaultValue={timeString} title='Format: MM/DD/YYYY hh:mm:ss' required />
			<input type='submit' id='submit' value='Add Task' />
		</form>
	);
}

function Task({text, time, index, remove}) {
	//expired tracks the expiration status of a task, updated by expire
	const [expired, expire] = useReducer(() => true, false);
	//finished tracks the completion status of a task, updated by finish
	const [finished, finish] = useReducer(val => true, false);

	return (
		<div>
			<button className='taskitem'
				onClick={() => expired ? f => f : finish()}
				style={{
					backgroundColor: (!finished && !expired) ? 'white' :
						(expired) ? 'lightcoral' : 'palegreen',
					color: expired ? 'yellow' : 'black'
				}}
			>
				{text}
			</button>
			<RemoveTask remove={remove} index={index} />
			<Timer dateString={time} onExpire={expire} finished={finished} />
		</div>
	);
}

function RemoveTask({remove, index}) {
	return (
		<button className='removetask'
			onClick={() => remove(index)}
		>
			Remove
		</button>
	);
}

function Timer({dateString, onExpire, finished}) {
	//expireDate expresses dateString as a JS Date object
	const expireDate = new Date(dateString);
	//calculate the difference (in seconds) between expireDate and the current time
	const calcDiff = () => Math.round((expireDate.getTime() - Date.now()) / 1000);

	//diff tracks the remaining time using calcDiff
	const [diff, updateDiff] = useReducer(calcDiff, calcDiff());
	//trigger tracks the expiration of the timer
	const [trigger, setTrigger] = useState(false);
	//timer points to the ticking setInterval (allowing us to stop the timer)
	const timer = useRef();

	//setup timer tick rate in the browser on render
	useEffect( () => {
		if (!finished) {
			timer.current = setInterval(tick, 1000);
			return () => clearInterval(timer.current);
		}
		clearInterval(timer.current);
	});

	//update diff state every second
	const tick = () => {
		updateDiff();
		if (diff - 1 > 0 && !trigger) {
			return
		} else if (!trigger) {
			setTrigger(true);
			onExpire();
		}
	}

	//return the remaining time in human-readable format
	const displayRemaining = () => {
		let secs = Math.abs(diff);
		const days = Math.floor(secs / 86400);
		secs -= (days * 86400);
		const hours = Math.floor(secs / 3600);
		secs -= (hours * 3600);
		const mins = Math.floor(secs / 60);
		secs -= (mins * 60);

		let remaining = ``;
		if (days !== 0) remaining += `${days} Day(s)`;
		if (hours !== 0) remaining += ` ${hours} Hour(s)`;
		if (mins !== 0) remaining += ` ${mins} Minute(s)`;
		if (secs !== 0) remaining += ` ${secs} Second(s)`;
		return remaining;
	}

	return (
		<p title={`Due: ${dateString}`}>
			{trigger ? `${displayRemaining()} late` : `${displayRemaining()} left`}
		</p>
	);
}