import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

export function UserRow({ user }) {
  const router = useRouter()

  const editState = async (id, state) => {
    try {
      const newState = state == 1 ? 0 : 1
      await axios.delete("/api/users/" + id, { data: { estado: newState } });
      toast.success("Estado actualizado", { position: "top-right" });
      router.push("/users");
    } catch (error) {
      console.error(errorerror.response.data.message);
      toast.error(error.response.data.message, { position: "top-right" });
    }
  };
  return (
    <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
      <td className="whitespace-nowrap px-6 py-4 font-medium ">{user.nombre_completo}</td>
      <td className="whitespace-nowrap px-6 py-4">{user.usuario}</td>
      <td className="whitespace-nowrap px-6 py-4">{user.tipo_perfil}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-row">
          <Link href={`/users/edit/${user.id_usuario}`}>
            <a className="icon-button" key={user.id_usuario}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-8 md:h-8">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
              </svg>
            </a>
          </Link>
          <button key={user.id_usuario}
            className={`ml-2 rounded-md p-2 ${user.estado === 1 ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
            onClick={() => editState(user.id_usuario, user.estado)}
          >
            {user.estado === 1 ? "Desactivar" : "Activar"}
          </button>
        </div>
      </td>
    </tr>
  );
}
