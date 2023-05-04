import NewPage from "pages/users/new";
import axios from "axios";
// export default newPage;
export default function myComponent({ validate, perfiles }) {
  return (
    <>
      <NewPage validate={validate} perfiles={perfiles} />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { data: perfiles } = await axios.get(
    "http://localhost:3000/api/profiles",
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