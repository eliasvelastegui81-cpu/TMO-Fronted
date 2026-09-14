import { useState } from 'react';

function TaskDetailModal({ task, onClose, onGuardar }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'pendiente');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título no puede estar vacío');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        status,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los cambios en la tarea');
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalle de Tarea #{task.id}</h3>
          <button type="button" className="btn-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Título:</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la tarea"
              disabled={guardando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Descripción:</label>
            <textarea
              id="task-desc"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles o notas adicionales sobre la tarea..."
              disabled={guardando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status">Estado:</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={guardando}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {task.created_at && (
            <p className="task-created-info">
              <small>📅 Creada el: {task.created_at}</small>
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskDetailModal;
