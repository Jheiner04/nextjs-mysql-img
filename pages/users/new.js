import axios from "axios";
import { UserForm } from "components/UserForm";
import { Layout } from "components/Layout";

function NewPage({ validate, perfiles }) {
  return (
    <Layout validate={validate}>
      <div className="h-5/6 grid place-items-center">
        <UserForm perfiles={perfiles} />
      </div>
    </Layout>
  );
}
export default NewPage;

export const getServerSideProps = async (context) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: perfiles } = await axios.get(
    `${apiUrl}/api/profiles`,
    {
      headers: {
        cookie: context.req.headers.cookie || "", // Incluye la cookie de sesión en la solicitud
      },
      withCredentials: true, // Permite enviar cookies en solicitudes de otro dominio
    }
  );

  return {
    props: {
      perfiles: perfiles.results,
      validate: perfiles.validate
    },
  };
};
