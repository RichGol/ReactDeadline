/* https://lively-rock-0b79e3a10.azurestaticapps.net/ */
import React, { useEffect, useState, useRef, useReducer } from "react";

/* RENDERS THE TICKING COUNTDOWN TIMER FOR TASKS */
function Timer({dateString, onFinish})  {
	//expireDate expresses the dateString as a JS Date Object
	const expireDate = new Date(dateString);
	//calcDiff returns the difference between expireDate and the current time in seconds
	const calcDiff = () => Math.round((expireDate.getTime() - Date.now()) / 1000);
	
	//diff tracks the remaining time using calcDiff
	const [diff, updateDiff] = useReducer(calcDiff, calcDiff());
	//trigger tracks the expiration of the timer
	const [trigger, setTrigger] = useState(false);

	//sets up and breaks down the timer tick rate in the browser window
	useEffect( () => {
		let timerID = setInterval(tick, 1000);
		return () => clearInterval(timerID);
	});

	//handles the logic of expiring and updating diff
	const tick = () => {
		updateDiff();
		if (diff - 1 >= 0 && !trigger) {
			return
		} else if (!trigger) {
			setTrigger(true);
			onFinish();	
		}
	}

	//handles the logic of displaying the remaining time in human-readable format
	const displayRemaining = () => {
		let secs = Math.abs(diff);
		const days = Math.floor(secs / 86400);
		secs -= (days * 86400);
		const hours = Math.floor(secs / 3600);
		secs -= (hours * 3600);
		const mins = Math.floor(secs / 60);
		secs -= (mins * 60);

		if (days !== 0) {
			return `${days} Day(s) ${hours} Hour(s) ${mins} Minute(s) ${secs} Second(s)`;
		} else if (days === 0 && hours !== 0) {
			return `${hours} Hour(s) ${mins} Minute(s) ${secs} Second(s)`;
		} else if (days === 0 && hours === 0 && mins !== 0) {
			return `${mins} Minute(s) ${secs} Second(s)`;
		}
		return `${secs} Second(s)`;
	}

	return (
		<p title={`Due: ${dateString}`}>
			{trigger ? `${displayRemaining()} late` : `${displayRemaining()} left`}
		</p>
	);
}

/* RENDERS TASK DESCRIPTIONS */
function TaskItem({expired, text, action}) {
	return (
		<button
			className='taskitem'
			onClick={action}
			style={{
				backgroundColor: expired ? 'red' : 'white',
				color: expired ? 'yellow' : 'black'
			}}
		>
			{text}
		</button>
	);
}

/* RENDERS EACH TASK (A DESCRIPTION PLUS A TIMER) */
function Task({itemNo, text, expiration, remove}) {
	//expired tracks the expiration status of a task, expire updates this status
	const [expired, expire] = useReducer(() => true, false);

	return (
		<div>
			<TaskItem 
				expired={expired}
				text={text}
				action={() => alert(`Task: ${text}\nExpired: ${expired}`)}
			/>
			<RemoveTask remove={remove} itemNo={itemNo}/>
			<Timer dateString={expiration} onFinish={expire}/>
		</div>
	);
}

/* RENDERS A FORM TO ADD TASKS */
function AddTask({add}) {
	//taskDesc refers to the description form input element
	//taskExpir refers to the expiration form input element
	const taskDesc = useRef();
	const taskExpir = useRef();

	//these patterns restrict user form entries to match date and time standards
	const datePattern = '(0?[1-9]|1[0-2])[/-](0?[1-9]|[12][0-9]|3[01])[/-]([0-9]{4})';
	const timePattern = '(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])( [AaPp][Mm])?';
	const regexPat = `(${datePattern}) +(${timePattern})`;
	//time and timeString pre-fills the expiration form input with the current date
	const time = new Date();
	const timeString = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} `

	//processes the submission of the HTML form element, adding the task and resetting the form
	const submit = e => {
		e.preventDefault();
		const desc = taskDesc.current.value;
		const expir = taskExpir.current.value;
		add(desc, expir);
		taskDesc.current.value = '';
		taskExpir.current.value = timeString;
		taskDesc.current.focus();
	}

	return (
		<form onSubmit={submit}>
			<p>Task:</p>
			<input ref={taskDesc} type='text' placeholder='task name' title='task name' required />
			<p>Expiration: </p>
			<input ref={taskExpir} type='text' placeholder='date/time' pattern={regexPat}
			defaultValue={timeString}
			title='Format: MM/DD/YYYY hh:mm:ss' required />
			<input type='submit' id='submit' value='Add Task' />
		</form>
	);
}

/* RENDERS A BUTTON TO REMOVE TASKS */
function RemoveTask({remove, itemNo}) {
	return (
			<button 
				className='removetask'
				onClick={() => remove(itemNo)}
			>
				Remove
			</button>
	)
}

/* RENDERS THE DEADLINEWEBSERVICE APP */
function RenderApp({user}) {
	//tasks stores an array of current tasks
	const [tasks, setTasks] = useState([]);
	//keyVal provides a unique key for each created task
	const [keyVal, setKeyVal] = useState(0);

	// Loads three Task objects on first render
	useEffect( () => {
		const temp = [{
				key: 0,
				itemNo: 1,
				text: 'task 1',
				expiration: '5/6/2021 10:30:00'
			},{
				key: 1,
				itemNo: 2,
				text: 'task 2',
				expiration: '5/6/2021 11:30:00'
			},{
				key: 2,
				itemNo: 3,
				text: 'task 3',
				expiration: '5/6/2021 12:30:00'
		}];
		loadTasks(temp);
	}, []);

	//loads tasks from an array of JSON objects
	const loadTasks = temp => {
		//load keyVal state, preventing overlap with new tasks
		const lastKey = temp[temp.length - 1].key;
		setKeyVal(lastKey+1);
		//populate tasks with loaded tasks
		temp.map((task, i) => setTasks(allTasks => [...allTasks, task]));
	}

	//appends a new task to the tasks array
	const addTask = async (text, expiration, key=keyVal, itemNo=tasks.length) => {
		const item = {
			key: key,
			itemNo: itemNo,
			text: text,
			expiration: expiration
		};
		setKeyVal(keyVal + 1);
		setTasks(allTasks => [...allTasks, item]);
		/* await fetch('http://127.0.0.1:80/add-task', {
			method: "POST",
			mode: "no-cors",
			body: JSON.stringify({user: user, tasks: item.text, timer: item.expiration})
		}); */
	}

	//removes the specified task from the tasks array
	const removeTask = (itemNo) => {
		let newTasks = tasks.filter( (task, i) => !(task.itemNo === itemNo))
		.map( (task, i) => {
			if (task.itemNo !== i+1) {
				task.itemNo = i+1;
			}
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
	);
}

/* RENDERS THE ENTRY PAGE */
function EntryPage({setUser}) {
	//user refers to the username form input element
	const user = useRef();

	//processes the submission of the HTML form element, saving the username
	const submit = async e => {
		e.preventDefault();
		const name = user.current.value
		setUser(name);
		user.current.value = '';
		/* await fetch('http://127.0.0.1/add-user', {
			method: "POST",
			mode: "no-cors",
			body: JSON.stringify({user: name}),
		}); */
	}

	return (
		<form onSubmit={submit}>
			<input ref={user} type='text' placeholder='username' required />
			<input type='submit' id='submit' value='Enter' />
		</form>
	);
}

/* RENDERS THE OVERALL APPLICATION */
export default function App() {
	const [user, setUser] = useState('');
	if (user) {
		return <RenderApp user={user} />;
	}
	return <EntryPage setUser={setUser} />;
}