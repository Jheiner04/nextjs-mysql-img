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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      validate
    },
  };
};