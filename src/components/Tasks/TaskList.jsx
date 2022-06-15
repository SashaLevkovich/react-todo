import React, { useState } from 'react';

import { FaPen } from 'react-icons/fa';
import { MdDone } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { ImCheckmark } from 'react-icons/im';

const TaskList = ({ list, id, completed, text, onRemove, onEdit, onComplete }) => {
	const [canEdit, setCanEdit] = useState(true);
	const [newTask, setNewTask] = useState('');
	
	const onChangeCheckbox = e => {
		onComplete(list.id, id, e.target.checked);
	};
	
	const changeTask = () => {
		setCanEdit(false)
	}
	
	return (
		<div key={`task id ${ id }`} className="tasks__items-row">
			<label htmlFor={ `task-${ id }` } className="checkbox">
				<input
					id={ `task-${ id }` }
					type="checkbox"
					checked={completed}
					onChange={onChangeCheckbox}
				/>
				<div className="checkbox__status">
					<MdDone className="checked"/>
				</div>
			</label>
			{
				canEdit
				?
					(
						<h3  className="tasks__text">
							{ text }
							<div className="tasks__items-row-actions">
								<FaPen
									onClick={ changeTask }
									className="edit"
								/>
								<MdDelete
									onClick={() => onRemove(list.id, id)}
									className="delete"
								/>
							</div>
						</h3>
					)
				:
					(
						<>
							<input
								defaultValue={ text  }
								onChange={ e => setNewTask(e.target.value) }
								className="tasks__text" />
							<div
								className="done button"
								onClick={()=> onEdit(list.id, { id, newTask }, setCanEdit) }
							>
								<ImCheckmark
									className="tasks__change-icon done__icon"
								/>
								<h6>Изменить</h6>
							</div>
						</>
					)
			}
		</div>
	);
};

export default TaskList;