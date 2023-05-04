import axios from "axios";
import { PanelForm } from "components/PanelForm";
import { Layout } from "components/Layout";

function NewPage({ validate }) {
  return (
    <Layout validate={validate}>
      <div className="h-5/6 grid place-items-center">
        <PanelForm />
      </div>
    </Layout>
  );
}
export default NewPage;

export const getServerSideProps = async (context) => {
  const { data: validate } = await axios.get(
    "http://localhost:3000/api/auth/validate",
    {
      headers: {
        cookie: context.req.headers.cookie || "", // Incluye la cookie de sesión en la solicitud
      },
      withCredentials: true, // Permite enviar cookies en solicitudes de otro dominio
    }
  );

  return {
    props: {
      validate
    },
  };
};
