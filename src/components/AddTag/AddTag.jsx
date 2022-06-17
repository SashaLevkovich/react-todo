import React, { useEffect, useState } from 'react';
import axios from 'axios';

import List from '../List/List';
import Badge from '../Badge/Badge';

import './AddTag.scss';

import { MdAdd } from 'react-icons/md';
import { RiCloseCircleFill } from 'react-icons/ri';

const AddTag = ({ colors, onAddTag }) => {
	const [active, setActive] = useState(false);
	const [selectColor, setSelectColor] = useState(3);
	const [inputValue, setInputValue] = useState('');
	const [load, setLoad] = useState(false);
	
	useEffect(()=>{
		if (Array.isArray(colors)) {
			setSelectColor(colors[0].id);
		}
	}, [colors])
	
	const clearPopup = () =>{
		setActive(false);
		setInputValue('');
		setSelectColor(colors[0].id);
	}
	
	const addTag = () => {
		if ( !inputValue ) {
			alert('Введите название тега');
			return;
		}
		
		setLoad(true);
		
		 axios
			.post('https://todo-server-sl.herokuapp.com/lists', { name: inputValue, colorId: selectColor }, {
				headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credential': true }
			})
			.then(({ data })=> {
			const color = colors.filter(color => color.id === selectColor)[0];
			const listObj = { ...data, color, tasks: []}
			onAddTag(listObj);
			clearPopup();
			})
			.catch(e => "Ошибка при добавлении тега!")
			.finally(()=> setLoad(false))
	}
	
	
	return (
		<div className="add-tag">
			<List
				onClick={()=>{setActive(!active)}}
				items={[
					{
						className: "list__add-icon" ,
						icon: <MdAdd className="add-tag__cros"/>,
						name: 'Добавить тег',
					},
				]}
			/>
			{ active &&
				<div className="add-tag popup">
					
					<RiCloseCircleFill
						className="popup__close"
						onClick={clearPopup}
					/>
					
				<input
					type="text"
					className="field"
					placeholder="Название тега"
					value={inputValue}
					onChange={(e)=>setInputValue(e.target.value)}
				/>
				
				<div className="popup__colors">
					{
						colors.map(( color, idx ) =>
							<Badge
								className={selectColor === color.id && 'active'}
								onClick={()=> setSelectColor(color.id)}
								key={`Color idx ${idx}`}
								color={ color.name }
						/>)
					}
				</div>
				<button onClick={addTag} className="button">
					{
						load ? 'Добавление...' : 'Добавить'
					}
				</button>
			</div> }
		</div>
	);
};

export default AddTag;