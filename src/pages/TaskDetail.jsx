import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/task-detail.css';

const ESTADOS_MAP = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
};

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados de datos de la tarea y vista
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para el formulario controlado de edición
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendiente');

  // Cargar los datos de la tarea al montar o cambiar el ID
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setSuccess(null);

    api.get(`/tasks/${id}`)
      .then((response) => {
        if (!isMounted) return;
        const taskData = response.data.data;
        setTask(taskData);
        setTitle(taskData.title || '');
        setDescription(taskData.description || '');
        setStatus(taskData.status || 'pendiente');
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response?.status === 404) {
          setError('La tarea solicitada no existe o no tienes permisos para consultarla.');
        } else {
          setError('Error al cargar la tarea. Comprueba tu conexión con el backend.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Iniciar modo edición
  const handleStartEdit = () => {
    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status || 'pendiente');
    setError(null);
    setSuccess(null);
    setIsEditing(true);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status || 'pendiente');
    setError(null);
    setIsEditing(false);
  };

  // Guardar cambios mediante formulario controlado y PATCH a la API
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.patch(`/tasks/${id}`, {
        title: title.trim(),
        description: description.trim() || null,
        status,
      });

      const updatedTask = response.data.data;
      setTask(updatedTask);
      setIsEditing(false);
      setSuccess('¡Tarea actualizada exitosamente!');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error al intentar guardar los cambios.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="task-detail-container">
        <Link to="/dashboard" className="task-detail-back-link">
          ← Volver al tablero
        </Link>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando información de la tarea #{id}...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="task-detail-container">
        <Link to="/dashboard" className="task-detail-back-link">
          ← Volver al tablero
        </Link>
        <div className="not-found-state">
          <h2>No se pudo abrir la tarea</h2>
          <div className="alert alert-error">{error}</div>
          <button type="button" onClick={() => navigate('/dashboard')}>
            Regresar al Tablero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-container">
      <Link to="/dashboard" className="task-detail-back-link">
        ← Volver al tablero
      </Link>

      {success && (
        <div className="alert alert-success" role="status">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠ {error}
        </div>
      )}

      <div className={`task-detail-card ${task.status}`}>
        <div className="task-detail-id">Tarea #{task.id}</div>

        {isEditing ? (
          /* Formulario controlado de edición */
          <form onSubmit={handleSubmitEdit} className="task-edit-form">
            <h2>Editar Tarea</h2>

            <div className="form-field">
              <label htmlFor="task-title">Título *</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                maxLength={255}
                required
                disabled={saving}
              />
            </div>

            <div className="form-field">
              <label htmlFor="task-desc">Descripción</label>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción detallada (opcional)..."
                rows={5}
                disabled={saving}
              />
            </div>

            <div className="form-field">
              <label htmlFor="task-status">Estado</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="task-edit-buttons">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Guardando cambios...' : '💾 Guardar cambios'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          /* Vista de solo lectura / detalle */
          <>
            <div className="task-detail-header">
              <h2>{task.title}</h2>
              <span className={`badge ${task.status}`}>
                {ESTADOS_MAP[task.status] || task.status}
              </span>
            </div>

            <div className="task-detail-section">
              <div className="task-detail-section-title">Descripción</div>
              <div className={`task-detail-description ${!task.description ? 'empty' : ''}`}>
                {task.description ? task.description : 'Sin descripción especificada.'}
              </div>
            </div>

            <div className="task-detail-metadata">
              <div>
                <strong>Estado actual:</strong> {ESTADOS_MAP[task.status] || task.status}
              </div>
              {task.created_at && (
                <div>
                  <strong>Fecha de creación:</strong> {task.created_at}
                </div>
              )}
            </div>

            <div className="task-detail-actions">
              <button type="button" className="btn-edit" onClick={handleStartEdit}>
                ✏️ Editar tarea
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskDetail;
