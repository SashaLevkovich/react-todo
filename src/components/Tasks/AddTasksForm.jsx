import React, { useState } from 'react';
import axios from 'axios';

import { MdAdd } from 'react-icons/md';

const AddTasksForm = ({ list, colors, onAddTask, addNewTag }) => {
	const [add, setAdd] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState('');
	
	const visibleForm = () => {
		setAdd(!add);
		setInputValue('')
	}
	
	const fetchTask = task => {
		axios
			.post('http://localhost:3001/tasks', task, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			}).then(({ data }) => {
				onAddTask(list.id, data);
				visibleForm();
			})
			.catch(e => {
				alert('Ошибка при добавлении задачи!');
			})
			.finally(() => {
				setIsLoading(false)
			});
	}
	
	const newTagTask = () => {
		const newTag = (inputValue.split('#')[1]);
		if ( newTag ) {
			axios
				.post('http://localhost:3001/lists', { name: newTag, colorId: 3 }, {
					headers: { 'Access-Control-Allow-Origin': '*' }
				})
				.then(({ data })=> {
					const color = colors.filter(color => color.id === 3)[0];
					const listObj = { ...data, color, tasks: []}
					addNewTag(listObj);
					const newTask = {
						listId: listObj.id,
						text: inputValue,
						completed: false
					}
					fetchTask(newTask);
				})
		}
	}
	
	const addTask = () => {
		if ( inputValue.indexOf('#') ) {
			newTagTask();
		}
			const task = {
				listId: list.id,
				text: inputValue,
				completed: false
			};
		fetchTask(task);
		setIsLoading(true)
	}
	
	return (
		<div className="tasks__form">
			{!add
				?
				(
					<div
						className="tasks__form-new"
						onClick={ visibleForm }
					>
						<MdAdd className="tasks__add-icon"/>
						<h3>Новая заметка</h3>
					</div>
				)
				:
				(
					<div className="tasks__form-add">
						<input
							type="text"
							className="field"
							placeholder="Название заметки"
							value={ inputValue }
							onChange={ e =>setInputValue(e.target.value) }
						/>
						
						<button
							disabled={isLoading}
							className="button"
							onClick={ addTask }
						>
							{isLoading ? "Добавление заметки..." : "Добавить заметку"}
						</button>
						<button
							className="button button--grey"
							onClick={ visibleForm }
						>
							Отмена
						</button>
					</div>
				)
			}
		</div>
	);
};

export default AddTasksForm;