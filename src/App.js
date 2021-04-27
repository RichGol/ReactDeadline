import React, {useEffect, useState, useRef} from 'react';

/* HANDLES VIEW OF REMAINING TIME */
function Timer({seconds, onFinish})  {
	//remaining tracks the remaining time on the timer
	const [remaining, setRemaining] = useState(seconds);
	//trigger tracks the expiration of the timer
	const [trigger, setTrigger] = useState(false);

	/**********************************************
	 * Handles setting up and breaking down timer *
	 * tick rate in the browser window.           *
	 **********************************************/
	useEffect( () => {
		let timerID = setInterval(() => tick(), 1000);
		return () => clearInterval(timerID);
	});

	/*******************************************
	 * Handles updating state of remaining and *
	 * trigger.                                *
	 *******************************************/
	const tick = () => {
		if (remaining - 1 >= 0 && !trigger) {
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

/* HANDLES VIEW OF TASK DESCRIPTION */
function TaskItem({itemNo, expired, text, action}) {
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

/* HANDLES VIEW OF A TASK */
function Task({itemNo, text, expiration, remove}) {
	//expired tracks the expiration status of a task
	const [expired, setExpired] = useState(false);
	
	/*********************************************
	 * Handles modifying expired state when task *
	 * expires.                                  *
	 *********************************************/
	const expire = () => setExpired(true);

	return (
		<div>
			<TaskItem 
				itemNo={itemNo}
				expired={expired}
				text={text}
				action={() => alert(`Task: ${text}\nExpired: ${expired}`)}
			/>
			<RemoveTask remove={remove} itemNo={itemNo}/>
			<Timer seconds={expiration} onFinish={expire}/>
		</div>
	);
}

/* HANDLES LOGIC AND VIEW OF ADDING TASKS */
function AddTask({add}) {
	//taskDesc is used to refer to the description form input element
	const taskDesc = useRef();
	//taskExpir is used to refer to the expiration form input element
	const taskExpir = useRef();

	/* const datePattern = '(0?[0-9]|1[0-2])[/-](0?[0-9]|[12][0-9]|3[01])[/-]([0-9]{4})';
	const timePattern = '(0?[1-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])( AM| PM)?';
	const regexPat = `(${datePattern}) +(${timePattern})`; */

	/********************************************************
	 * Processes the submission of the HTML form element,   *
	 * enabling us to add tasks with custom names and times *
	 ********************************************************/
	const submit = e => {
		e.preventDefault();
		const desc = taskDesc.current.value;
		const expir = taskExpir.current.value;
		add(desc, expir);
		//console.log(expir, new Date(expir));
		taskDesc.current.value = '';
		taskExpir.current.value = '';
		taskDesc.current.focus();
	}

	return (
		<>
			<form onSubmit={submit}>
				<p>Task Name:</p>
				<input ref={taskDesc} type='text' placeholder='task name' required />
				<p>Expiration Date/Time:</p>
				<input ref={taskExpir} type='text' /* pattern={regexPat} */
				placeholder='MM/DD/YYYY hh:mm:ss' required />
				<input type='submit' id='submit' value='Add Task' />
			</form>
		</>
	);
}

/* HANDLES LOGIC AND VIEW OF REMOVING TASKS */
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

/* RENDERS THE WHOLE APPLICATION */
export default function App() {
	//tasks state manages the current set of tasks
	const [tasks, setTasks] = useState(new Array());
	//nextItem state tracks the number of active tasks
	const [nextItem, setNextItem] = useState(1);
	//keyVal state provides a unique key for each task instance
	const [keyVal, setKeyVal] = useState(0);

	/********************************************
	 * Loads three Task objects on first render *
	 ********************************************/
	useEffect( () => {
		const temp = [{
				key: 0,
				itemNo: 1,
				text: 'task 1',
				expiration: 10
			},{
				key: 1,
				itemNo: 2,
				text: 'task 2',
				expiration: 20
			},{
				key: 5,
				itemNo: 6,
				text: 'task 3',
				expiration: 30
		}];
		loadTasks(temp);
	}, []);

	/*******************************************
	 * Handles loading tasks from an array of  *
	 * objects, eventually to load saved tasks *
	 * from a file.                            *
	 *******************************************/
	const loadTasks = temp => {
		//update keyVal state, preventing overlap with other tasks
		const lastKey = temp[temp.length - 1].key;
		setKeyVal(lastKey+1);
		//update nextItem state, preventing overlap with other tasks
		const lastItemNo = temp[temp.length - 1].itemNo;
		setNextItem(lastItemNo+1);
		//update tasks state with loaded tasks
		temp.map((task, i) => {
			setTasks(allTasks => [...allTasks, task]);
		});
	}

	/************************************************
	 * Handles appending a task to the tasks state, *
	 * updating nextItem automatically              *
	 ************************************************/
	const addTask = (text, expiration, key=keyVal, itemNo=nextItem) => {
		const item = {
			key: key,
			itemNo: itemNo,
			text: text,
			expiration: expiration
		};
		setKeyVal(keyVal + 1);
		setNextItem(nextItem + 1);
		setTasks(allTasks => [...allTasks, item]);
	}

	/************************************************************
	 * Handles popping the specified task from the tasks state, *
	 * updating nextItem and tasks automatically                *
	 ************************************************************/
	const removeTask = (itemNo) => {
		let newTasks = tasks.filter( (task, i) => !(task.itemNo === itemNo))
		.map( (task, i) => {
			if (task.itemNo !== i+1) {
				task.itemNo = i+1;
			}
			return task;
		});
		setTasks(newTasks);
		setNextItem(nextItem - 1);
	}

	return (
		<>
			<AddTask add={addTask} />
			{tasks.map( task => (
				<Task remove={removeTask} {...task} />
			))}
		</>
	);
}
