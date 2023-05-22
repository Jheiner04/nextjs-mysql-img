/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font, PDFDownloadLink } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { useMediaQuery } from '@material-ui/core';


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
        marginBottom: 5,
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
    },
    imagendos: {
        position: 'relative',
        width: '40%',
        // height: '65%',
        objectFit: 'fill',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
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
                    {expedienteCredito.imagenes.map((imagen, index) => {
                        try {
                            return (
                                // <View key={index} style={{ display: 'flex', height: '100%', width: '100%', position: 'relative' }}>
                                <View key={index}>
                                    <Image
                                        style={styles.imagendos}
                                        // src={'/optimaze/resize-' + imagen.url}
                                        src={'/uploads/' + imagen.url}
                                    />
                                    <Text style={styles.desciption}>Imagen N°{index + 1 + ': \n' + imagen.descripcion}</Text>
                                </View>
                            );
                        } catch (error) {
                            console.log('Error al cargar la imagen:', error);
                            return null;
                        }
                    })}

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
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <>
            {isMobile ?
                <PDFDownloadLink
                    document={<PDF expedienteCredito={expedienteCredito} />}
                    fileName={'PanelFotográfico' + expedienteCredito.expediente.id_expediente_credito + '.pdf'}
                    className="ml-2 rounded-md p-2 bg-red-500 text-white"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? 'Cargando documento...' : 'Descargar Panel Fotográfico'
                    }
                </PDFDownloadLink> :
                <PDFViewer style={styles.viewer}>
                    <PDF expedienteCredito={expedienteCredito} />
                </PDFViewer>
            }
        </>
    )
}
export default PDFView