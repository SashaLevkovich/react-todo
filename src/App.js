import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { List, AddTag, Tasks } from './components/components';

import { TiThMenuOutline } from 'react-icons/ti';

function App() {
    const [lists, setLists] = useState([]);
    const [colors, setColors] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [tag, setTag] = useState(null);
    
    const location = useLocation();
    
    let navigate = useNavigate();
    
    useEffect(()=> {
            axios
                .get('http://localhost:3001/lists?_expand=color&_embed=tasks', {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                })
                .then(({ data }) => {
                    setLists(data);
                });
            axios
                .get('http://localhost:3001/colors', {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                })
                .then(({ data }) => {
                    setColors(data);
                });
    }, [tag]);
    
    const onAddTag = tag =>{
        if ( tag.name !== lists.name ) {
            const newTag = [
                ...lists, tag
            ];
            setLists(newTag);
        }
    };
    
    const onAddTask = (listId, task ) =>{
        const newTask = lists.map(list => {
            if ( list.id === listId ) {
                list.tasks= [...list.tasks, task];
            }
            return list;
        });
        setLists(newTask);
    };
    
    const onEditTagTitle = (id, title) => {
        const newList = lists.map(list => {
            if ( list.id === id ) {
                list.name = title;
            }
            return list
        })
        setLists(newList);
    };
    
    const onRemoveTask = (listId, taskId) => {
        if (window.confirm('Вы действительно хотите удалить задачу?')) {
            const newList = lists.map(item => {
                if (item.id === listId) {
                    item.tasks = item.tasks.filter(task => task.id !== taskId);
                }
                return item;
            });
            setLists(newList);
            axios
                .delete('http://localhost:3001/tasks/' + taskId, {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                })
                .catch(() => {
                alert('Не удалось удалить задачу');
            });
        }
    };
    
    const onEditTask = (listId, taskObj, setCanEdit) => {
        if ( taskObj ) {
            const newList = lists.map(item => {
                if (item.id === listId) {
                    item.tasks = item.tasks.map(task => {
                        if ( task.id === taskObj.id ) {
                            task.text = taskObj.newTask;
                        }
                        return task;
                    });
                }
                return item;
            });
            setCanEdit(true);
            setLists(newList);
            axios
                .patch('http://localhost:3001/tasks/' + taskObj.id, {text: taskObj.newTask}, {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                })
                .catch(() => {
                    alert('Не удалось удалить задачу');
                });
        } else return;
    };
    
    const onCompleteTask = (listId, taskId, completed) => {
        const newList = lists.map(list => {
            if (list.id === listId) {
                list.tasks = list.tasks.map(task => {
                    if (task.id === taskId) {
                        task.completed = completed;
                    }
                    return task;
                });
            }
            return list;
        });
        setLists(newList);
        axios
            .patch('http://localhost:3001/tasks/' + taskId, {
                completed
            }, {
                headers: { 'Access-Control-Allow-Origin': '*' }
            })
            .catch(() => {
                alert('Не удалось обновить задачу');
            });
    }
    
    useEffect(() => {
        const listId = location.pathname.split('lists/')[1];
        if ( lists ) {
            const  list = lists.find(list => list.id === Number(listId));
            setActiveTag(list);
        }
    }, [lists, location.pathname]);
    
  return (
        <div className="todo">
            <div className="todo__sidebar">
                <List
                    onClickItem={() => {
                        navigate(`/`);
                    }}
                    items = {[
                    {
                        active: location.pathname === '/',
                        icon: <TiThMenuOutline className="todo__icon" />,
                        name: 'Все задачи',
                    },
                ]}
                />
                
                {lists ? (
                    <List
                        items={ lists }
                        onRemove={id => {
                            const newLists = lists.filter(item => item.id !== id);
                            setLists(newLists);
                        }}
                        onClickItem={list => {
                            navigate(`/lists/${list.id}`);
                        }}
                        activeTag={ activeTag }
                        isRemove
                        onChoose={item => item ? setActiveTag(item) : null}
                    />
                ) : (
                    'Загрузка...'
                )}
                
                <AddTag onAddTag={ onAddTag } colors = { colors }/>
            </div>
        
             <div className="todo__tasks">
                 <Routes>
                     <Route exact path="/" element={
                         lists &&
                         lists.map( list =>
                             <Tasks
                                 key={list.id}
                                 list={ list }
                                 onAddTask={ onAddTask }
                                 onEditTitle={ onEditTagTitle }
                                 onRemoveTask={ onRemoveTask }
                                 onEditTask={ onEditTask }
                                 onCompleteTask={ onCompleteTask }
                                 colors = { colors }
                                 setTag={setTag}
                                 withoutEmpty
                             />
                         )
                     }
                     />
                     <Route exact path="/lists/:id" element={
                         lists && activeTag && (
                             <Tasks
                                 list={ activeTag }
                                 onAddTask={ onAddTask }
                                 onEditTitle={ onEditTagTitle }
                                 onRemoveTask={ onRemoveTask }
                                 onEditTask={ onEditTask }
                                 onCompleteTask={ onCompleteTask }
                                 setTag={setTag}
                                 colors = { colors }
                                 
                             />
                         )
                     }
                     />
                 </Routes>
            </div>
        </div>
  );
}

export default App;
