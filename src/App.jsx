import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, addDoc, deleteDoc, } from 'firebase/firestore';
import { db } from './firebase/firebase';
import { Archivo, Equis } from './components/Figuras';


const App = () => {
  const [tareas, setTareas] = useState([
    { id: 1, descripcion: "Tareas" },
  ]);
  const [input, setInput] = useState("");
  const input1 = (evento) => {
    setInput(evento.target.value);
  };
  const agregarTarea = () => {
    setTareas([
      ...tareas,
      { id: Math.floor(Math.random() * 1000), descripcion: input },
    ]);
    setInput("")
  };
  const eliminarTarea = (identificacion) => {
    const nuevasTareas = tareas.filter(
      (elemento) => elemento.id !== identificacion
    );
    setTareas(nuevasTareas)
  };

  const solicitud = async () => {
    const individual = await getDocs(collection(db, "productos"));
    const array = individual.docs.map((elemento) => ({
      datos: elemento.data(),
      id: elemento.id,
    }));
    setImprimir(array);
  };


  // const solicitud = async () => {
  //   const querySnapshot = await getDocs(collection(db, "producto"));
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, "=>", doc.data());
  //   });

  // };

  const [imprimir, setImprimir] = useState();
  const [cambio, setCambio] = useState(false);

  const eliminarFirebase = async (id) => {
    await deleteDoc(doc(db, "producto", id));
    setCambio(!cambio);
  };

  const añadirFirebase = async () => {
    const docRef = await addDoc(collection(db, "producto"), {
      producto: input,
    });
    console.log("Document written with ID: ", docRef.id);
    setCambio(!cambio);
    setInput("");
  };

  useEffect(() => {
    solicitud();
  }, [cambio]);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center items-center gap-1'>
        <label className="input input-bordered flex items-center gap-2">
          <form onSubmit={(e) => { e.preventDefault(); agregarTarea(); }}>
            <input onChange={input1} type="text" className="grow" placeholder="Ingrese la tarea" value={input} />
          </form>
        </label>
        {/* <input type="text" onChange={input1} placeholder="" className="input input-bordered input-info w-full max-w-xs" value={input} /> */}
        <button onClick={agregarTarea} className="btn btn-success">Añadir tarea</button>
        {/* <button onClick={solicitud} className="btn btn-success">Producto</button> */}
        <button onClick={añadirFirebase} className="btn btn-success">Añadir a firebase</button>
      </div>

      <div className="flex flex-col items-center justify-center">
        {tareas && tareas.map((elemento) => (
          <div key={elemento.id} className='mt-5 flex gap-10 justify-center items-center'>
            <h1 className='text-[30px] border border-blue-400 p-3 rounded-md'>{elemento.descripcion}</h1>
            <button onClick={() => { eliminarTarea(elemento.id); }} className="btn btn-circle btn-outline">
              <Equis />
            </button>
          </div>
        ))}
      </div>

      {imprimir && imprimir.map((elemento) => (
        <div key={elemento.id} className='mt-5 flex gap-10 justify-center items-center'>
          <h1 className='font-bold text-[40px]'>{elemento.datos.productos}</h1>
          <button onClick={() => eliminarFirebase(elemento.id)} className="btn btn-circle btn-outline">
            Eliminar de firebase
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;