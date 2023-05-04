import NewPage from "pages/panel/new";
import axios from "axios";
// export default newPage;
export default function myComponent({ validate }) {
  return (
    <>
      <NewPage validate={validate} />
    </>
  );
}

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