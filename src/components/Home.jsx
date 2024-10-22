import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Home = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [tasks, setTasks] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3003/addtask', { name });
            setMessage(response.data.msg);
        } catch (err) {
            console.error(err);
        }
        setName('');
        fetchTasks();
    };

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:3003/alltask');
        setTasks(response.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3003/removetask/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (id, completed) => {
        try {
            await axios.put(`http://localhost:3003/updatetask/${id}`, { completed: !completed });
            setTasks(tasks.map((task) =>
                task._id === id ? { ...task, completed: !completed } : task
            ));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center py-10">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm mb-6 border border-gray-200"
            >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">To-Do List</h2>
                {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add a New Task</h2> */}
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Enter your task"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border  focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-full hover:from-green-500 hover:to-blue-600 transition-colors"
                    >
                        Add Task
                    </button>
                </div>
                {message && (
                    <p className="text-green-600 mt-3 text-center font-semibold">{message}</p>
                )}
            </form>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
                
                {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center">No tasks available</p>
                ) : (
                    <ul className="space-y-3">
                        {tasks.map((task) => (
                            <li
                                key={task._id}
                                className={`p-4 rounded-lg flex items-center justify-between shadow-md ${task.completed ? 'bg-green-200' : 'bg-yellow-200'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggle(task._id, task.completed)}
                                        className="h-5 w-5 text-blue-500 focus:ring-blue-400" />
                                    <span className={`${task.completed ? 'line-through text-gray-600' : 'text-gray-800 font-medium'}`}>
                                        {task.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default Home;
