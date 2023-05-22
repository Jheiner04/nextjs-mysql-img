import axios from "axios";
import { Layout } from "components/Layout";
import { UserRow } from "components/UserRow";

function UsersPage({ users = [], validate }) {
  const renderUsers = () => {
    if (users.length === 0) return <tr><td className="p-3">Sin usuarios</td></tr>;
    return users.map((user) => (
      <UserRow key={user.id_usuario} user={user} />
    ));
  };

  return (
    <Layout validate={validate}>
      <div className="flex flex-col overflow-x-auto">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="bg-green-800 table-auto min-w-full text-left text-sm font-light rounded">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Nombre</th>
                  <th scope="col" className="px-6 py-4">Usuario</th>
                  <th scope="col" className="px-6 py-4">Perfil</th>
                  <th scope="col" className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {renderUsers()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UsersPage;

export const getServerSideProps = async (context) => {
  const { data: users } = await axios.get(
    "http://localhost:3000/api/users",
    {
      headers: {
        cookie: context.req.headers.cookie || "", // Incluye la cookie de sesión en la solicitud
      },
      withCredentials: true, // Permite enviar cookies en solicitudes de otro dominio
    }
  );

  return {
    props: {
      users: users.results,
      validate: users.validate
    },
  };
};