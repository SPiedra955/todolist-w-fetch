import React, { useEffect, useState } from "react";


//create your first component
const Home = () => {

	const url = 'https://playground.4geeks.com/todo'
	const [myUser, setMyUser] = useState('Samu')
	const [data, setData] = useState({})
	useEffect(() => { getMyUser() }, [])
	const [newTask, setNewTask] = useState('')
	const [error, setError] = useState('')


	const getMyUser = async () => {
		try {
			const resp = await fetch(`${url}/users/${myUser}`)
			if (resp.status === 404) return createUser()
			if (!resp.ok) throw new Error('Error en GET')
			const userData = await resp.json()
			console.log(userData);
			setData(userData)
		} catch (error) {
			console.log(error)
		}
	}

	const createUser = async () => {
		try {
			const resp = await fetch(`${url}/users/${myUser}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (resp.ok) return getMyUser();
			throw new Error('Error en método POST')
		} catch (error) {
			console.log(error)
		}

	}

	const createTodos = async (e) => {
		e.preventDefault();
		try {
			if (newTask.trim().length === 0) return setError('No puede estar vacía la tarea')
			if (newTask.trim().length < 3) return setError('Tiene que ser superior a 3 caracteres')
			const formattedData = {
				label: newTask.trim(),
				is_done: false
			}
			const resp = await fetch(`${url}/todos/${myUser}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formattedData)
			})
			if (!resp.ok) throw new Error('Request not ok');
			setNewTask('')
			return getMyUser()
		} catch (error) {
			console.log(error)
		}
	}

	const deleteTodo = async (id) => {
		try {
			const resp = await fetch(url + '/todos/' + id, {
				method: "DELETE"
			})
			if (!resp.ok) throw new Error('Error deleting ')
			return getMyUser()
		} catch (error) {
			console.log(error)
			setError(error)

		}
	}

	const updateTodos = async ({ id, label, is_done }) => {
		try {
			const formattedData = {
				label,
				is_done: !is_done
			}
			const resp = await fetch(url + '/todos/' + id, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formattedData)
			})
			if (!resp.ok) throw new Error('Error completing task')
			return getMyUser()
		} catch (error) {
			console.log(error)
			setError(error)
		}
	}

	return (
		<div className="text-center">

			<h1 className="text-center mt-5">Hello Rigo!</h1>

		</div>
	);
};

export default Home;