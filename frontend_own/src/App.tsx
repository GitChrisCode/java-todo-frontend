import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { Todo } from './model/Todo'


function App() {

  const [inputFieldDescription, setInputFieldDescription] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    axios.get('api/todo')
        .then(response => setTodos(response.data))
        .catch(console.error);
  }, []);

  function postTodo() {
    const newTodo:Todo = {
      description: inputFieldDescription,
      status:"OPEN",
      id: ""
    }
      axios.post('api/todo', newTodo)
          .then(response => {
              setTodos([...todos, response.data]);
              setInputFieldDescription("");
          })
          .catch(console.error);
  }
    function changeTodoStatus(todo: Todo, status: string) {
        todo.status = status;
        axios.put(`api/todo/${todo.id}`, todo)
            .then(response => {
                setTodos(todos.map(todo => todo.id === todo.id ? {...todo, status} : todo));
            })
            .catch(console.error);
    }

    function deleteTodo(id: string) {
        axios.delete(`api/todo/${id}`)
            .then(response => {
                setTodos(todos.filter(todo =>todo.id !== id));
            })
             .catch(console.error);
    }

    return (
    <div>
      <h1>Super Duper Kanban</h1>
      <form onSubmit={event => {event.preventDefault();postTodo();}}>
        <input type={"text"} value={inputFieldDescription} onChange = {event =>setInputFieldDescription(event.target.value)}/>
        <button type={"submit"}>Add Todo</button>
      </form>

        <div>
            <div className={"Todo"}>
                <h4>ToDo</h4>
                <ul>
                        {todos.filter(todos => todos.status.includes("OPEN")).map(todo => (
                        <li key={todo.id}>{todo.description} - {todo.status}
                            <button onClick={() => changeTodoStatus(todo, "IN_PROGRESS")}>Advance</button>
                        </li>))}
                </ul>
            </div>
            <div className={"Doing"}>
                <h4>Doing</h4>
                <ul>
                        {todos.filter(todos => todos.status.includes("IN_PROGRESS")).map(todo => (
                        <li key={todo.id}>{todo.description} - {todo.status}
                            <button onClick={() => changeTodoStatus(todo, "DONE")}>Advance</button></li>))}
                </ul>
            </div>
            <div className={"Done"}>
                <h4>Done</h4>
                <ul>
                        {todos.filter(todos => todos.status.includes("DONE")).map(todo => (
                        <li key={todo.id}>{todo.description} - {todo.status}
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button></li>))}
                </ul>
            </div>
        </div>
    <ul>

    </ul>
    </div>
  );
}
export default App;
