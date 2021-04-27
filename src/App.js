import React, {useReducer} from 'react';

/* handles the view of a task description */
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
	)
}

function Task({itemNo, text, expiration, remove}) {
	//expired tracks the status of a task
	const [expired, expire] = useReducer(() => true, false)

	return (
		<div>
			<TaskItem 
				itemNo={itemNo}
				expired={expired}
				text={text}
				action={() => alert(`Task: ${text}\nExpired: ${expired}`)}
			/>
			<button onClick={() => expire()}>Expire!</button>
		</div>
	);
}

export default function App() {
	return (
		<Task itemNo={1} expiration={false} text='sample' remove={f => f} />
	);
}