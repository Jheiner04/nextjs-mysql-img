import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    user: "",
    password: "",
  });
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const router = useRouter();

  const handleSubmit = async (e) => {
    let errors = {}
    e.preventDefault();
    try {
      const apiUrlImg = process.env.NEXT_PUBLIC_API_URL_IMG;
      // const res = await axios.post(`/api/auth/login`, credentials);
      // const res = await axios.post(`${apiUrlImg}/api/auth/login`, credentials);
      const res = axios({
        method: "post",
        url: `${apiUrlImg}/api/auth/login`,
        withCredentials: false,
        data: credentials
      })
      if (res.status === 200) {
        router.push("/panel");
      }
    } catch (error) {
      console.log(error)
      if (error.response.status === 401 || error.response.status === 500) {
        errors.login = error.response.data.error
        setErrors(errors)
      } else {
        console.log('Login error:', error.response.data)
      }
    }
  };

  return (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold bg-white rounded-md">
          <Image src="/img/LogoAmazonas_transparente.png" className="w-8 h-8 mr-2" alt="logo" width={300} height={100} />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
                <input type="text" name="user" id="user" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" autoComplete="off"
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      user: e.target.value.trim(),
                    })
                  }
                  required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                <div className="relative">
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type={showPassword ? "text" : "password"}
                    placeholder="•••••••••"
                    id="password"
                    name="password"
                    autoComplete="off"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value.trim(),
                      })
                    }
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
                {errors.login && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
                  <span className="block sm:inline">{errors.login}</span>
                </div>}
              </div>
              <button type="submit" className="w-full bg-green-700 text-white hover:bg-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Ingresar
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;