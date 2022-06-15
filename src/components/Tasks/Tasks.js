import React, { useState } from 'react';
import axios from 'axios';

import AddTasksForm from './AddTasksForm';
import TaskList from './TaskList';

import './Tasks.scss';

import { FaPen } from 'react-icons/fa';
import { ImCheckmark } from 'react-icons/im';

const Tasks = ({
	               list,
	               onEditTitle,
	               onAddTask,
	               withoutEmpty,
	               onRemoveTask,
	               onEditTask,
	               onCompleteTask,
	               setTag,
	               colors,
}) => {
	
	const [canEdit, setCanEdit] = useState(true);
	const [newTitle, setNewTitle] = useState('');
	
	
	const addNewTag = tag => {
		setTag(tag);
	}
	
	const change = () => {
		setCanEdit(false)
	}
	
	const editTitle = () => {
		if ( newTitle ) {
			onEditTitle(list.id, newTitle)
			axios.patch('http://localhost:3001/lists/' + list.id, {
				name: newTitle
			}, {
					headers: { 'Access-Control-Allow-Origin': '*' }
				})
				.catch(()=> alert('Не удалось изменить название списка!'))
		}
			setCanEdit(true)
	}
	
	return (
		<div className="tasks">
			{
				
				canEdit
					?
					(
						<h2 style={{ color: list.color.hex }} className="tasks__title">
							{ list.name }
							<FaPen
								onClick={ change }
								className="tasks__change-icon"
							/>
						</h2>
					)
					:
					(
						<div className="tasks__head">
							<input
								style={{ color: list.color.hex }}
								className="tasks__title"
								defaultValue={ list.name }
								onChange={e => setNewTitle(e.target.value)}
							/>
							
							<div
								onClick={ editTitle }
								className="done button"
							>
								<ImCheckmark
									className="tasks__change-icon done__icon"
								/>
								<h5>Изменить</h5>
							</div>
						</div>
					)
			}
			
			<div  className="tasks__items">
				{ !withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачи отсутствуют</h2> }
				{
					list.tasks && list.tasks.map(task => (
						<TaskList
							key={ task.id }
							list={ list }
							onRemove={ onRemoveTask }
							onEdit={ onEditTask }
							onComplete ={ onCompleteTask }
							{ ...task }
						/>
					))
				}
				<AddTasksForm
					key={ list.id }
					onAddTask={ onAddTask }
					list={ list }
					addNewTag={ addNewTag }
					colors = { colors }
				/>
			</div>
		</div>
	);
};

export default Tasks;