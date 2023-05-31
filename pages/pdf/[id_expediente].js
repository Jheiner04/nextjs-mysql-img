
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react"
import { Layout } from "components/Layout";


const InvoicePDF = dynamic(() => import("components/pdf"), {
    ssr: false,
});


const View = ({ expedienteCredito, query }) => {

    const [client, setClient] = useState(false)

    useEffect(() => {
        setClient(true)
    }, [])

    return (
        <Layout validate={query}>
            <InvoicePDF expedienteCredito={expedienteCredito} />
        </Layout>

    )
}

export const getServerSideProps = async ({ query }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data: expediente } = await axios.get(
        `${apiUrl}/api/expedientes/` + query.id_expediente
    );

    const { data: imagenes } = await axios.get(
        `${apiUrl}/api/images/expediente/` + query.id_expediente
    );
    const expedienteCredito = {
        expediente,
        imagenes
    }
    return {
        props: {
            expedienteCredito,
            query
        },
    };
};

export default View