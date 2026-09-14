function TaskCard({ id, title, description, status, created_at, onCambiarEstado, onEliminar, onVerDetalle }) {
  const siguiente = {
    pendiente: 'en_progreso',
    en_progreso: 'completada',
    completada: null,
  };

  return (
    <div className={`task-card ${status}`}>
      <h4>{title}</h4>
      <span className={`badge ${status}`}>{status}</span>
      <div className="task-card-actions">
        <button
          type="button"
          onClick={() => onVerDetalle({ id, title, description, status, created_at })}
          className="btn-detalle"
          title="Ver detalle y editar"
        >
          ✏️ Detalle
        </button>
        {siguiente[status] && (
          <button type="button" onClick={() => onCambiarEstado(id, siguiente[status])}>
            ➡️ Avanzar
          </button>
        )}
        <button
          type="button"
          onClick={() => onEliminar(id)}
          className="btn-eliminar"
          title="Eliminar tarea"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
