import Link from "next/link";
import { useRouter } from "next/router";

export function PanelRow({ expediente, validate }) {
  const router = useRouter()

  const handleClick = async () => {

    router.push({
      pathname: `/pdf/${expediente.id_expediente_credito}`,
      query: validate,
    });
  }


  const fechaMySQL = expediente.fecha_hora_creacion;
  const fechaLocal = new Date(fechaMySQL);
  const dia = fechaLocal.getDate().toString().padStart(2, '0');
  const mes = (fechaLocal.getMonth() + 1).toString().padStart(2, '0');
  const anio = fechaLocal.getFullYear();
  const hora = fechaLocal.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
  const fechaFormateada = `${dia}/${mes}/${anio} ${hora}`;
  return (
    <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
      <td className="whitespace-nowrap px-6 py-4 font-medium ">{expediente.dni}</td>
      <td className="whitespace-nowrap px-6 py-4">{expediente.nombre_completo}</td>
      <td className="whitespace-nowrap px-6 py-4">{fechaFormateada}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-row">
          <Link href={`/panel/edit/${expediente.id_expediente_credito}`}>
            <a className="icon-button" key={expediente.id_expediente_credito}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-8 md:h-8">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
              </svg>
            </a>
          </Link>
          {/* <Link href={`/pdf/${expediente.id_expediente_credito}`}> */}
          <a className="icon-button" onClick={handleClick} key={expediente.id_expediente_credito}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-8 md:h-8">
              <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
              <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
            </svg>
          </a>
          {/* </Link> */}
        </div>
      </td>
    </tr>
  );
}
