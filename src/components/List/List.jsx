import React from 'react';
import axios from 'axios';
import classNames from 'classnames';

import Badge from '../Badge/Badge';

import './List.scss';

import { VscClose } from 'react-icons/vsc'

const List = ({ items, isRemove, onClick, onRemove, onChoose, activeTag, onClickItem  }) => {
	const removeList = (item) => {
		if ( window.confirm("Вы действительно хотите удалить?") ) {
			axios.delete('http://todo-server-sl.herokuapp.com/lists/' + item.id, {
				headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credential': true }
			}).then(() => onRemove(item.id))
		}
	}
	
	return (
			<ul
				className="list"
				onClick={onClick}
			>
				{ items.map((item, idx)=>(
					<li
						key={`List index ${idx}`}
						className={classNames(item.className,
							{active:  item.active ? item.active : activeTag && activeTag.id === item.id}
						)}
						onClick={onClickItem ? () => onClickItem(item) : null}
					>
						
						{item.icon ? item.icon : <Badge color={ item.color.name }/>}
						<h3>{ item.name } { item.tasks && ` ( ${item.tasks.length} )` }</h3>
						{isRemove && (<VscClose onClick={()=>removeList(item)} className="list__remove"/>)}
						
					</li>
					)
				)}
			</ul>
	);
};

export default List;