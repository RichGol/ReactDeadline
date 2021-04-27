import React from 'react';

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

export default function App() {
	return (
		<TaskItem itemNo={1} expired={false} text='sample' action={f => f} />
	);
}