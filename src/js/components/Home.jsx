import React, { useEffect, useState } from "react";


//create your first component
const Home = () => {

	const url = 'https://playground.4geeks.com/todo'
	const [myUser, setMyUser] = useState('Samu')
	const [data, setData] = useState({})
	useEffect(() => { getMyUser() }, [])

	const getMyUser = async () => {
		try {
			const resp = await fetch(`${url}/users/${myUser}`)
			if (resp.status === 404) return createUser()
			if (!resp.ok) throw new Error('Error en GET')
			const data = await resp.json()
			console.log(data);
			return setData(data)
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



	return (
		<div className="text-center">

			<h1 className="text-center mt-5">Hello Rigo!</h1>

		</div>
	);
};

export default Home;