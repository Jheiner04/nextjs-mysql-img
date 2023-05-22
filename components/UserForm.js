import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export function UserForm({ perfiles }) {
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [user, setUser] = useState({
    id_perfil: "",
    nombre_completo: "",
    email: "",
    usuario: "",
    clave: "",
    confirmar_clave: "",
  });

  const router = useRouter();

  const resetForm = () => {
    setUser({
      id_perfil: "",
      nombre_completo: "",
      email: "",
      usuario: "",
      clave: "",
      confirmar_clave: "",
    });
  };

  useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const { data } = await axios.get("/api/users/" + id);
        setUser(prevUser => ({ ...prevUser, nombre_completo: data.nombre_completo, email: data.email, usuario: data.usuario, id_perfil: data.id_perfil }));
        setSelectedValue(data.id_perfil.toString());
      } catch (error) {
        console.error(error);
      }
    };

    if (router.query?.id) {
      fetchUser(router.query.id);
      setEditForm(true);
    } else {
      resetForm();
      setChangePassword(true);
      setEditForm(false);
    }
  }, [router.query.id]);

  useEffect(() => { //Valores válidos para nombre
    const inputNombre = document.getElementById("nombre_completo");

    inputNombre.addEventListener("keydown", (event) => {
      const esLetra = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(event.key);
      const esNavegacion = ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].indexOf(event.key) !== -1;

      if (!esLetra && !esNavegacion) {
        event.preventDefault();
      }
    });

  }, []);

  useEffect(() => { //Valores válidos para usuario
    const inputUsuario = document.getElementById("usuario");

    inputUsuario.addEventListener("keydown", (event) => {
      const esLetraNumero = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+$/.test(event.key);
      const esNavegacion = ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].indexOf(event.key) !== -1;

      if (!esLetraNumero && !esNavegacion) {
        event.preventDefault();
      }
    });

  }, []);

  useEffect(() => { //Valores válidos para email
    const inputEmail = document.getElementById("email");

    inputEmail.addEventListener("keydown", (event) => {
      const esEmail = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9@._-]+$/.test(event.key);
      const esNavegacion = ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].indexOf(event.key) !== -1;

      if (!esEmail && !esNavegacion) {
        event.preventDefault();
      }
    });

  }, []);

  const handleChange = ({ target: { name, value } }) => { //Cambios conforme va digitalizando
    setUser({ ...user, [name]: value });
    if (name == 'id_perfil') {
      setSelectedValue(value);
    }
  }

  const [errors, setErrors] = useState({})

  const onValidate = (user) => {
    let errors = {}
    let regerLeters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    let regerLetersNumbers = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+$/;
    let regerEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.id_perfil == "") { errors.perfil = "Campo Perfil obligatorio"; }

    if (!user.nombre_completo.trim()) {
      errors.nombre_completo = "Campo Nombre obligatorio"
    } else if (!regerLeters.test(user.nombre_completo)) {
      errors.nombre_completo = "Campo Nombre sólo letras y espacios"
    }

    if (!user.email.trim()) {
      errors.email = "Campo Email obligatorio"
    } else if (!regerEmail.test(user.email)) {
      errors.email = "Formato Email inválido"
    }

    if (!user.usuario.trim()) {
      errors.usuario = "Campo Usuario obligatorio"
    } else if (!regerLetersNumbers.test(user.usuario)) {
      errors.usuario = "Campo Usuario sólo acepta letras y números"
    }

    if (changePassword) {
      if (!user.clave.trim()) {
        errors.clave = "Campo Contraseña obligatorio"
      } else if (user.clave.trim().length < 8) {
        errors.clave = "La contraseña debe tener al menos 8 caracteres"
      }

      if (!user.confirmar_clave.trim()) {
        errors.confirmar_clave = "Campo Confirmar Contraseña obligatorio"
      } else if (user.clave.trim() != user.confirmar_clave.trim()) {
        errors.confirmar_clave = "Contraseñas no coinciden"
      }
    }

    return errors
  }

  function handleCheckboxChange(event) {
    setChangePassword(event.target.checked);
    if (!event.target.checked) {
      user.clave = '';
      user.confirmar_clave = '';
    }
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const err = onValidate(user)
    setErrors(err)

    if (Object.keys(err).length === 0) {
      try {
        if (router.query?.id) {
          await axios.put("/api/users/" + router.query.id, user);
          toast.success("Usuario editado con éxito", { position: "top-right", });
        } else {
          await axios.post("/api/users", user);
          toast.success("Usuario guardado con éxito", { position: "top-right", });
        }

        router.push("/users");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

  };

  return (
    <div className="w-full">
      <form
        className="bg-white dark:bg-gray-800 shadow-md rounded md:px-10 px-3 pt-6 pb-8 mb-4 md:mx-10 "
        encType="multipart/form-data"
        onSubmit={handleFormSubmit}
      >
        <label
          className="block text-gray-700 dark:text-white font-bold mb-2 text-md"
        >
          Datos del usuario
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <label
              htmlFor="id_perfil"
              className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
            >
              Perfil:
            </label>
            <select id="id_perfil" name="id_perfil" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChange}
              value={selectedValue} required>
              <option value="">Seleccionar perfil</option>
              {perfiles.map((perfil) => (
                <option key={perfil.id_perfil} value={perfil.id_perfil}>
                  {perfil.tipo_perfil}
                </option>
              ))}
            </select>
            {errors.perfil && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.perfil}</span>
            </div>}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="nombre_completo"
            >
              Nombre:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
              type="text"
              placeholder="Ingresa nombre"
              id="nombre_completo"
              name="nombre_completo"
              onChange={handleChange}
              value={user.nombre_completo}
              autoComplete="off"
              required
            />
            {errors.nombre_completo && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.nombre_completo}</span>
            </div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
              type="email"
              placeholder="Ingresa email"
              id="email"
              name="email"
              onChange={handleChange}
              value={user.email}
              autoComplete="off"
              required
            />
            {errors.email && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.email}</span>
            </div>}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="usuario"
            >
              Usuario:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
              type="text"
              placeholder="Ingresa usuario"
              id="usuario"
              name="usuario"
              onChange={handleChange}
              value={user.usuario}
              autoComplete="off"
              required
            />
            {errors.usuario && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.usuario}</span>
            </div>}
          </div>
        </div>
        {editForm && (<div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="flex items-center mb-4">
            <input
              id="checkbox"
              type="checkbox"
              checked={changePassword}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cambiar contraseña</label>
          </div>
        </div>)}
        {changePassword && (
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <div className="mb-4">
              <label
                htmlFor="clave"
                className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
              >
                Contraseña:
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••"
                  id="clave"
                  name="clave"
                  onChange={handleChange}
                  value={user.clave}
                  autoComplete="off"
                  disabled={!changePassword}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
                  onClick={toggleShowPassword}
                >
                  {showPassword ?
                    (<svg fill="none" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>)
                    : (<svg fill="none" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>)}
                </button>
              </div>
              {errors.clave && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
                <span className="block sm:inline">{errors.clave}</span>
              </div>}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                htmlFor="confirmar_clave"
              >
                Confirmar contraseña:
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••"
                  id="confirmar_clave"
                  name="confirmar_clave"
                  onChange={handleChange}
                  value={user.confirmar_clave}
                  autoComplete="off"
                  disabled={!changePassword}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
                  onClick={toggleShowPassword}
                >
                  {showPassword ?
                    (<svg fill="none" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>)
                    : (<svg fill="none" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>)}
                </button>
              </div>
              {errors.confirmar_clave && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
                <span className="block sm:inline">{errors.confirmar_clave}</span>
              </div>}
            </div>
          </div>
        )}

        <div className="flex justify-center items-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {router.query?.id ? "Editar" : "Registrar"}
          </button>
        </div>
      </form>
    </div>

  );
}
