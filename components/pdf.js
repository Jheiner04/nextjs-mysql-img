/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { useState, useEffect } from "react";

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        padding: 50,
        fontFamily: "Oswald"
    },
    viewer: {
        width: "100%",
        height: "100vh",
    },
    '@media (min-width: 768px)': {
        viewer: {
            width: "80vw",
            height: "80vh",
        },
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    date: {
        fontSize: 12,
        textAlign: "right",
        fontWeight: "bold",
    },
    textHeader: {
        fontSize: 12,
        textAlign: "left",
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    desciption: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
        color: 'grey',
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald'
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
    }
});

const PDF = ({ expedienteCredito }) => {
    const fechaMySQL = expedienteCredito.expediente.fecha_hora_creacion;
    const fechaLocal = new Date(fechaMySQL);
    const dia = fechaLocal.getDate().toString().padStart(2, '0');
    const mes = (fechaLocal.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaLocal.getFullYear();
    const hora = fechaLocal.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const fechaFormateada = `${dia}/${mes}/${anio} ${hora}`;
    return (
        <Document>
            <Page style={styles.body}>
                <View fixed style={styles.header}>
                    <Image src="/img/pagina_01.png" style={{ width: 140, height: 40 }} />
                    <Text style={styles.title}>Panel Fotográfico</Text>
                    <View style={styles.headerContent}>
                        <Text style={styles.textHeader}>Socio: {expedienteCredito.expediente.nombre_completo}</Text>
                        <Text style={styles.date}>Fecha: {fechaFormateada}</Text>
                    </View>
                    <Text style={styles.textHeader}>DNI: {expedienteCredito.expediente.dni}</Text>
                </View>
                <View wrap>
                    {expedienteCredito.imagenes.map((imagen, index) => (

                        <View key={index}>
                            <Image
                                style={styles.image}
                                // src={'/optimaze/resize-' + imagen.url}
                                src={'/uploads/' + imagen.url}
                            />
                            <Text style={styles.desciption}>Imagen N°{index + 1 + ': ' + imagen.descripcion}</Text>
                        </View>
                    ))}

                    {/* <Text>Goodbye, world!hgdkljfhsalhgfljadhsgflhasdlhfgsaljdhgflhasgflhgasdl;hfg;aksdjgf;kjsdahf;kjhasd;kjhf;kjashdf;kjhasd;kjfhjks;adhfkjhsadk;jfhaskjdhfkjsahdfkjhsadkj;hfkjsdhfkjhasd;kjhfkjsadhfkjhsda;kjh;</Text> */}

                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}
const PDFView = ({ expedienteCredito }) => {
    const [client, setClient] = useState(false)

    useEffect(() => {
        setClient(true)
    }, [])

    return (
        <PDFViewer style={styles.viewer}>
            <PDF expedienteCredito={expedienteCredito} />
        </PDFViewer>
    )
}
export default PDFView