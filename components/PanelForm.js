import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';

export function PanelForm() {
  const [disabledDNI, setDisabledDNI] = useState(false);
  const [disabledNombre, setDisabledNombre] = useState(false);
  const [disabledBtnImagen, setDisabledBtnImagen] = useState(true);
  const [disabledBtnSubmit, setDisabledBtnSubmit] = useState(false);
  const [socio, setSocio] = useState({
    id_socio: 0,
    nombre_completo: "",
    dni: ""
  });

  const [pathImage, setPathImage] = useState() //Todo: Verificar uso de pathImage, sino Eliminar 
  const router = useRouter();

  const resetForm = () => {
    setSocio({
      id_socio: 0,
      nombre_completo: "",
      dni: ""
    });
  };

  useEffect(() => {
    const fetchExpediente = async (id) => {
      try {
        const { data } = await axios.get("/api/expedientes/" + id);
        setSocio(prevSocio => ({ ...prevSocio, nombre_completo: data.nombre_completo, dni: data.dni }));

      } catch (error) {
        console.error(error);
      }
    };

    const fetchImages = async (id) => {
      try {
        const { data: imagenes } = await axios.get("/api/images/expediente/" + id);
        createTemplateEdit(imagenes);
        agregarEventoEliminar()

      } catch (error) {
        console.error(error);
      }
    };

    if (router.query?.id) {
      fetchExpediente(router.query.id);
      fetchImages(router.query.id);

      setDisabledDNI(true);
      setDisabledNombre(true);
      setDisabledBtnSubmit(true)
    } else {
      setDisabledDNI(false);
      setDisabledNombre(false);
      resetForm();
    }

    console.log("called");
  }, [router.query.id]);

  useEffect(() => {
    const fetchParnetName = async (dni) => {
      try {
        const { data } = await axios.get("/api/socios/dni/" + dni);
        if (data.nombre_completo) {
          socio.nombre_completo = data.nombre_completo
          socio.id_socio = data.id_socio > 0 ? data.id_socio : 0;
          document.getElementById("nombre_completo").value = socio.nombre_completo;
          setDisabledNombre(true);
          setDisabledBtnImagen(false)
        } else {
          socio.id_socio = 0;
          setDisabledNombre(false);
          document.getElementById("nombre_completo").placeholder = "Sin resultados, ingresa nombre";

        }

      } catch (error) {
        console.error(error);
      }
    };
    if (socio.dni.length === 8) {
      fetchParnetName(socio.dni)
    } else {
      socio.nombre_completo = ""
      document.getElementById("nombre_completo").value = socio.nombre_completo;
      setDisabledNombre(true);
    }

    if (socio.dni.length === 8 && document.getElementById("nombre_completo").value != '') {
      setDisabledBtnImagen(false)
    } else {
      setDisabledBtnImagen(true)
    }
    console.log("called Socio");
  }, [socio]);

  useEffect(() => {
    const inputNombre = document.getElementById("nombre_completo");

    inputNombre.addEventListener("keydown", (event) => {
      const esLetra = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(event.key);
      const esNavegacion = ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].indexOf(event.key) !== -1;

      if (!esLetra && !esNavegacion) {
        event.preventDefault();
      }
    });

  }, []);

  useEffect(() => {
    const inputDNI = document.getElementById("dni");

    inputDNI.addEventListener("keydown", (event) => {
      const esNumero = /^\d+$/.test(event.key);
      const esNavegacion = ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].indexOf(event.key) !== -1;

      if (!esNumero && !esNavegacion) {
        event.preventDefault();
      }
    });
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setSocio({ ...socio, [name]: value });
  }

  const createTemplate = () => {
    const container = document.createElement("div");
    const index = document.getElementsByClassName("form-row opcion").length;
    const uuid = uuidv4();
    container.className = "form-row opcion";
    const opcion = `
                    <div class="flex flex-col md:flex-row justify-start items-start gap-4 mb-4">
                      <label for="fileInput[${uuid}]" class="w-full md:w-auto">
                        <input class="file-input hidden" id="fileInput[${uuid}]" name="${uuid}" type="file" accept="image/*" />
                        <img class="rounded-md mx-auto md:mx-0 cursor-pointer" id="img[${uuid}]" name="img[${uuid}]" src='/img/uploadImage.jpg' alt="Image" width="100" />
                      </label>
                      <div class="w-full md:w-1/2.2">
                        <textarea name="description[${uuid}]" id="description[${uuid}]" rows="3" placeholder="Descripción" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white" maxlength="500" required></textarea>
                      </div>
                      <input type="button" class="md:w-1/5 bg-red-500 hover:bg-red-700 py-2 px-3 rounded eliminar" value="Eliminar">
                    </div>
                  `

    container.innerHTML = opcion;
    const fileInput = container.querySelector('.file-input');
    fileInput.addEventListener('change', (e) => {
      e.preventDefault();
      let subcadenas = e.target.id.split("fileInput")
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        if (file.type.includes("image")) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onload = function load() {
            setPathImage(reader.result)
            const imagen = document.getElementById('img' + subcadenas[1]);
            imagen.setAttribute('src', reader.result);
            setDisabledBtnSubmit(false);
          }
        } else {
          console.log("Esto no es una imagen")
        }
      }
    });

    const textAreas = document.querySelectorAll('textarea[name^="description"]');

    textAreas.forEach((textArea) => {
      textArea.addEventListener('click', (event) => {
        setDisabledBtnSubmit(false);
      });
    });

    return container;
  };

  const agregarEventoEliminar = () => {
    const btnsEliminar = document.getElementsByClassName("eliminar");
    for (const btn of btnsEliminar) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.closest(".form-row.opcion").remove();
        const imagenes = validateImages();
        setDisabledBtnSubmit(imagenes.length === 0);
      });
    }
  }

  const [errors, setErrors] = useState({})

  const addImageRow = () => {
    setDisabledBtnSubmit(false);
    const opciones = document.getElementsByClassName("opciones")[0];
    const childrenTotal = opciones.childElementCount;
    if (childrenTotal >= 10) {
      toast("Solo se permiten 10 imágenes", { position: "top-right", icon: '⚠' })
    } else {
      opciones.appendChild(createTemplate());
      agregarEventoEliminar()
    }
  }

  const onValidate = (socio) => {
    let errors = {}
    let regerLeters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    let regerNumbers = /^\d+$/

    if (!socio.dni.trim()) {
      errors.dni = "Campo DNI obligatorio"
    } else if (!regerNumbers.test(socio.dni)) {
      errors.dni = "Campo DNI sólo acepta números"
    }

    if (!socio.nombre_completo.trim()) {
      errors.nombre_completo = "Campo Nombre obligatorio"
    } else if (!regerLeters.test(socio.nombre_completo)) {
      errors.nombre_completo = "Campo Nombre sólo letras y espacios"
    }

    return errors
  }

  const createTemplateEdit = (images) => {
    const opciones = document.getElementsByClassName("opciones")[0];

    images.map((imagen, index) => {
      const uuid = uuidv4();
      const container = document.createElement("div");
      container.className = "form-row opcion";
      const opcion = `
                    <div class="flex flex-col md:flex-row justify-start items-start gap-4 mb-4">
                      <label for="fileInput[${uuid}]" class="w-full md:w-auto">
                        <img class="rounded-md mx-auto md:mx-0 cursor-pointer" id="${uuid}" name="img-${uuid}" src='/uploads/${imagen.url}' alt="Image" width="100" />
                      </label>
                      <div class="w-full md:w-1/2.2">
                        <textarea name="description[${uuid}]" id="description[${uuid}]" rows="3" placeholder="Descripción" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white" maxlength="500" required>${imagen.descripcion}</textarea>
                      </div>
                      <input type="button" class="md:w-1/5 bg-red-500 hover:bg-red-700 py-2 px-3 rounded eliminar" value="Eliminar">
                    </div>
                  `
      container.innerHTML = opcion;
      opciones.appendChild(container);

      // const fileInput = container.querySelector('.file-input');
      // fileInput.addEventListener('change', (e) => {
      //   e.preventDefault();
      //   let subcadenas = e.target.id.split("fileInput[")
      //   if (e.target.files && e.target.files.length > 0) {
      //     const file = e.target.files[0]
      //     if (file.type.includes("image")) {
      //       const reader = new FileReader()
      //       reader.readAsDataURL(file)

      //       reader.onload = function load() {
      //         setPathImage(reader.result)
      //         const imagen = document.getElementById(subcadenas[1].slice(0, -1));
      //         imagen.setAttribute('src', reader.result);
      //       }
      //       setDisabledBtnSubmit(false);
      //     } else {
      //       console.log("Esto no es una imagen")
      //     }
      //   }
      // });

      const textAreas = document.querySelectorAll('textarea[name^="description"]');

      textAreas.forEach((textArea) => {
        textArea.addEventListener('click', (event) => {
          setDisabledBtnSubmit(false);
        });
      });




    })

  };

  const guardarSocio = async (newSocio) => {
    try {
      const { data } = await axios.post("/api/socios", newSocio);
      toast.success("Socio guardado con éxito", { position: "top-right", });
      return data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }

  }

  const guardarExpediente = async (formData) => {

    try {
      // const { data } = await axios.post("/api/expedientes", formData);
      // console.log(formData.get('fileInput'))

      const { data } = await axios.post("/api/expedientes/stast2", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //previo
      toast.success("Expediente guardado con éxito", { position: "top-right", });
      return data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }

  }

  const actualizarExpediente = async (formData) => {

    try {
      const { data } = await axios.post("/api/expedientes/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //previo
      toast.success("Expediente actualizado con éxito", { position: "top-right", });
      return data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }

  }

  const validateImages = () => {
    const inputs = document.querySelectorAll('input[type="file"]');
    const imagenes = [];

    for (let i = 0; i < inputs.length; i++) {
      const files = inputs[i].files;
      for (let j = 0; j < files.length; j++) {
        imagenes.push(files[j]);
      }
    }
    return imagenes;
  }

  // En tu función de manejo de envío de formulario, puedes llamar a la función "guardarSocio" para guardar los datos del socio y las imágenes en el servidor
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const err = onValidate(socio)
    setErrors(err)
    if (Object.keys(err).length === 0) {
      const inputs = event.target.querySelectorAll('input[type="file"]');
      const imagenes = [];

      for (let i = 0; i < inputs.length; i++) {
        const files = inputs[i].files;
        for (let j = 0; j < files.length; j++) {
          imagenes.push(files[j]);
        }
      }

      if (!router.query.id && imagenes.length === 0) { toast.error("Agregar al menos una imagen", { position: "top-right", }); return false; }
      if (router.query.id && inputs.length > 0 && imagenes.length === 0) { toast.error("Agregar imagen para la nueva fila", { position: "top-right", }); return false; }

      const imgs = event.target.querySelectorAll('img[class="rounded-md mx-auto md:mx-0 cursor-pointer"]');

      const imagesObject = {};

      for (let t = 0; t < imgs.length; t++) {
        if (imgs[t].src.indexOf('uploads') > -1) {
          imagesObject[`${imgs[t].id}`] = imgs[t].src;
        }
      }

      try {
        if (router.query?.id) {
          //Se actualiza imágenes del expediente
          try {
            const formData = new FormData(event.target);
            formData.append("id_expediente", router.query.id)
            formData.append('imagesLoaded', JSON.stringify(imagesObject));
            const expedienteActualizado = await actualizarExpediente(formData);
            console.log(`Se ha actualizado el expediente con ID ${expedienteActualizado.id} y sus imágenes.`);
          } catch (error) {
            console.log(`No se pudo guardar el expediente y sus imágenes: ${error}`);
          }

        } else {
          if (socio.id_socio === 0) {
            // Se guarda socio
            try {
              const nuevoSocio = await guardarSocio(socio);
              setSocio({ id_socio: nuevoSocio.id, dni: nuevoSocio.dni, nombre_completo: nuevoSocio.nombre_completo });
              socio.id_socio = nuevoSocio.id;
              console.log(`Se ha guardado el socio con ID ${nuevoSocio.id}.`);
            } catch (error) {
              console.log(`No se pudo guardar el socio: ${error}`);
            }
          }
          //Se guarda expediente e imágenes
          try {
            const formData = new FormData(event.target);
            formData.append("id_socio", socio.id_socio)
            const nuevoExpediente = await guardarExpediente(formData);
            console.log(`Se ha guardado el expediente con ID ${nuevoExpediente.id} y sus imágenes.`);
          } catch (error) {
            console.log(`No se pudo guardar el expediente y sus imágenes: ${error}`);
          }
        }

        router.push("/panel");
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      }
    }

  };

  return (
    <div className="w-full">
      <form
        className="bg-white dark:bg-gray-800 shadow-md rounded md:px-10 px-3 pt-6 pb-8 mb-4 md:mx-10 "
        encType="multipart/form-data"
        onSubmit={handleFormSubmit}
      >
        {/* <form method="POST" action="/api/stats" encType="multipart/form-data"> */}
        <label
          className="block text-gray-700 dark:text-white font-bold mb-2 text-md"
        >
          Datos del socio
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <label
              htmlFor="dni"
              className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
            >
              DNI:
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
              name="dni"
              id="dni"
              placeholder="Ingresa DNI"
              onChange={handleChange}
              value={socio.dni}
              autoComplete="off"
              maxLength={8}
              minLength={8}
              disabled={disabledDNI}
            />
            {errors.dni && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.dni}</span>
            </div>}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="nombre_completo"
            >
              Nombre:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
              type="text"
              placeholder="Ingresa nombre"
              id="nombre_completo"
              name="nombre_completo"
              onChange={handleChange}
              value={socio.nombre_completo}
              autoComplete="off"
              disabled={disabledNombre}
            />
            {errors.nombre_completo && <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
              <span className="block sm:inline">{errors.nombre_completo}</span>
            </div>}
          </div>

        </div>
        <button type="button" className={`mb-4 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${disabledBtnImagen ? 'cursor-default opacity-50' : 'hover:bg-blue-700'}`} onClick={addImageRow} disabled={disabledBtnImagen}>
          + Agregar imagen
        </button>

        <div className="opciones"></div>

        <div className="flex justify-center items-center">
          <button type="submit" className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${disabledBtnSubmit ? 'cursor-default opacity-50' : 'hover:bg-blue-700'}`} disabled={disabledBtnSubmit}>
            {router.query?.id ? "Editar" : "Registrar"}
          </button>
        </div>
      </form>
    </div>

  );
}
