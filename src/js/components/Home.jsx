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

      const checkUser = await fetch(`${url}/users/${myUser}`);
      if (checkUser.ok) {
        setError("Usuario ya existe, cargando TODOS...");
        setMyUser("");
        return getMyUser();
      }

      const createUser = await fetch(`${url}/users/${myUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (createUser.ok) {
        setError("");
        setMyUser("");
        return getMyUser();
      }
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
      //   COGEMOS EL NOMBRE DEL USUARIO DEL JSON
      const resp = await fetch(`${url}/todos/${data.name}`, {
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
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4">
          {data.name
            ? `Lista de tareas de ${data.name}`
            : `Crea un usuario para empezar`}
        </h1>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {data.name ? (
          <form onSubmit={createTodos} className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nueva tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="btn btn-primary">Añadir</button>
          </form>
        ) : (
          <form onSubmit={createUser} className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de usuario..."
              value={myUser}
              onChange={(e) => setMyUser(e.target.value)}
            />
            <button className="btn btn-success">Crear</button>
          </form>
        )}

        <ul className="list-group border-0">
          {data.todos?.map((el) => (
            <li
              key={el.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                el.is_done ? "list-group-item-success" : ""
              }`}
            >
              <span
                className={el.is_done ? "text-decoration-line-through" : ""}
              >
                {el.label}
              </span>

              <div>
                <button
                  className={`btn btn-sm me-2 ${
                    el.is_done ? "btn-warning" : "btn-success"
                  }`}
                  onClick={() => updateTodos(el)}
                >
                  <FontAwesomeIcon
                    icon={el.is_done ? faCircleXmark : faCheck}
                  />
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteTodo(el.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
