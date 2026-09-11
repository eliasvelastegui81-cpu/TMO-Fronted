import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/task-detail.css';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setTask(null);
    setError('');
    setEditing(false);
    api.get(`/tasks/${id}`)
      .then((response) => {
        if (active) setTask(response.data.data);
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.status === 404
            ? 'No se encontró la tarea.'
            : 'No se pudo cargar la tarea. Comprueba tu conexión e inicia sesión nuevamente si es necesario.');
        }
      });
    return () => { active = false; };
  }, [id]);

  const editarTarea = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setError('');
    setEditing(true);
  };

  const guardarTarea = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para la tarea.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const response = await api.patch(`/tasks/${id}`, { title: title.trim(), description, status });
      setTask(response.data.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.status === 404
        ? 'No se encontró la tarea.'
        : 'No se pudieron guardar los cambios. Revisa los datos y la conexión.');
    } finally {
      setSaving(false);
    }
  };

  const estados = { pendiente: 'Pendiente', en_progreso: 'En progreso', completada: 'Completada' };

  return (
    <main className="task-detail">
      <Link to="/dashboard">Volver al tablero</Link>
      <h1>{editing ? 'Editar tarea' : 'Detalle de la tarea'}</h1>
      {error && <p role="alert">{error}</p>}
      {!task && !error && <p>Cargando tarea...</p>}
      {task && (editing ? (
        <form onSubmit={guardarTarea}>
          <label htmlFor="task-title">Título</label>
          <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} />
          <label htmlFor="task-description">Descripción</label>
          <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          <label htmlFor="task-status">Estado</label>
          <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(estados).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <div className="task-actions">
            <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
            <button type="button" disabled={saving} onClick={() => { setEditing(false); setError(''); }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          <h2>{task.title}</h2>
          <p className="task-description">{task.description || 'Sin descripción.'}</p>
          <p>Estado: {estados[task.status]}</p>
          <p>Creada: {task.created_at}</p>
          <button onClick={editarTarea}>Editar tarea</button>
        </>
      ))}
    </main>
  );
}

export default TaskDetail;
