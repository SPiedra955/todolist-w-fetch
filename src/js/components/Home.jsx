import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

//create your first component
const Home = () => {
  const url = "https://playground.4geeks.com/todo";
  const [myUser, setMyUser] = useState("");
  const [data, setData] = useState({});
  useEffect(() => {
    getMyUser();
  }, []);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  const getMyUser = async () => {
    try {
      const resp = await fetch(`${url}/users/${myUser}`);
      if (resp.status === 404) return createUser();
      if (!resp.ok) throw new Error("Error en GET");
      const userData = await resp.json();
      console.log(userData);
      setData(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      if (myUser.trim().length == 0)
        return setError("No puede estar vacía el campo usuario");
      if (myUser.trim().length < 3)
        return setError("Tiene que ser superior a 3 caracteres");
      const resp = await fetch(`${url}/users/${myUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        setError("");
        setMyUser("");
        return getMyUser();
      }
      throw new Error("Error en método POST");
    } catch (error) {
      console.log(error);
    }
  };

  const createTodos = async (e) => {
    e.preventDefault();
    try {
      if (newTask.trim().length === 0)
        return setError("No puede estar vacía la tarea");
      if (newTask.trim().length < 3)
        return setError("Tiene que ser superior a 3 caracteres");
      const formattedData = {
        label: newTask.trim(),
        is_done: false,
      };
      const resp = await fetch(`${url}/todos/${myUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      if (!resp.ok) throw new Error("Request not ok");
      setNewTask("");
      return getMyUser();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const resp = await fetch(url + "/todos/" + id, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Error deleting ");
      return getMyUser();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const updateTodos = async ({ id, label, is_done }) => {
    try {
      const formattedData = {
        label,
        is_done: !is_done,
      };
      const resp = await fetch(url + "/todos/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      if (!resp.ok) throw new Error("Error completing task");
      return getMyUser();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  // Quitar el error del estado
  useEffect(() => {
    if (error != "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <div className="text-center">
      <h1 className="text-center mt-5">
        {data.name
          ? `Lista de tareas de ${data.name}`
          : `Crea un usuario para crear lista TODOS`}
      </h1>

      {error && <div className="bg-danger"> {error}</div>}

      {data.name ? (
        <form onSubmit={createTodos}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input type="submit" />
        </form>
      ) : (
        <form onSubmit={createUser}>
          <input
            type="text"
            value={myUser}
            onChange={(e) => setMyUser(e.target.value)}
          />
          <input type="submit" value="Crear usuario" />
        </form>
      )}

      <ul>
        {data.todos?.map((el) => (
          <li key={el.id} className={el.is_done ? " bg-success" : "border"}>
            {el.label}
            <span onClick={() => updateTodos(el)}>
              <FontAwesomeIcon
                className="mx-3"
                icon={el.is_done ? faCircleXmark : faCheck}
              />
            </span>

            <span onClick={() => deleteTodo(el.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
