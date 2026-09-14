import { useState, useEffect } from 'react';
import api from '../services/api';
import Column from './Column';
import TaskDetailModal from './TaskDetailModal';
import '../styles/board.css';

function Board() {
  const [tasks, setTasks] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const cambiarEstado = (id, nuevoEstado) => {
    api.patch(`/tasks/${id}`, { status: nuevoEstado })
       .then(() => setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nuevoEstado } : t))));
  };

  const agregarTarea = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;
    api.post('/tasks', { title: nuevoTitulo, status: 'pendiente' })
       .then((response) => { setTasks([...tasks, response.data.data]); setNuevoTitulo(''); });
  };

  const eliminarTarea = (id) => {
    api.delete(`/tasks/${id}`).then(() => setTasks(tasks.filter((t) => t.id !== id)));
  };

  const actualizarTarea = async (id, datosActualizados) => {
    const response = await api.patch(`/tasks/${id}`, datosActualizados);
    const tareaActualizada = response.data.data;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...tareaActualizada } : t)));
    setTareaSeleccionada(null);
  };

  useEffect(() => {
    api.get('/tasks').then((response) => setTasks(response.data.data));
  }, []);

  const pendientes = tasks.filter((t) => t.status === 'pendiente');
  const enProgreso = tasks.filter((t) => t.status === 'en_progreso');
  const completadas = tasks.filter((t) => t.status === 'completada');

  return (
    <div className="board">
      <form onSubmit={agregarTarea}>
        <input
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button type="submit">➕ Agregar</button>
      </form>
      <Column
        title={`📋 Pendiente (${pendientes.length})`}
        tasks={pendientes}
        onCambiarEstado={cambiarEstado}
        onEliminar={eliminarTarea}
        onVerDetalle={setTareaSeleccionada}
      />
      <Column
        title={`🔄 En progreso (${enProgreso.length})`}
        tasks={enProgreso}
        onCambiarEstado={cambiarEstado}
        onEliminar={eliminarTarea}
        onVerDetalle={setTareaSeleccionada}
      />
      <Column
        title={`✅ Completada (${completadas.length})`}
        tasks={completadas}
        onCambiarEstado={cambiarEstado}
        onEliminar={eliminarTarea}
        onVerDetalle={setTareaSeleccionada}
      />

      {tareaSeleccionada && (
        <TaskDetailModal
          task={tareaSeleccionada}
          onClose={() => setTareaSeleccionada(null)}
          onGuardar={actualizarTarea}
        />
      )}
    </div>
  );
}

export default Board;
