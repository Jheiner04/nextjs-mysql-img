import axios from "axios";
import { Layout } from "components/Layout";
import { PanelRow } from "components/PanelRow";

function ExpedientesPage({ expedientes = [], validate }) {

  const renderExpedientes = () => {
    if (expedientes.length === 0) return <tr><td className="p-3">Sin elementos</td></tr>;
    return expedientes.map((expediente) => (
      <PanelRow key={expediente.id_expediente_credito} expediente={expediente} validate={validate} />
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
                  <th scope="col" className="px-6 py-4">DNI</th>
                  <th scope="col" className="px-6 py-4">Socio</th>
                  <th scope="col" className="px-6 py-4">Fecha y hora</th>
                  <th scope="col" className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {renderExpedientes()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ExpedientesPage;

export const getServerSideProps = async (context) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: expedientes } = await axios.get(
    `${apiUrl}/api/expedientes`,
    {
      headers: {
        cookie: context.req.headers.cookie || "", // Incluye la cookie de sesión en la solicitud
      },
      withCredentials: true, // Permite enviar cookies en solicitudes de otro dominio
    }
  );

  const { data: validate } = await axios.get(
    `${apiUrl}/api/auth/validate`,
    {
      headers: {
        cookie: context.req.headers.cookie || "", // Incluye la cookie de sesión en la solicitud
      },
      withCredentials: true, // Permite enviar cookies en solicitudes de otro dominio
    }
  );

  return {
    props: {
      expedientes,
      validate
    },
  };
};
