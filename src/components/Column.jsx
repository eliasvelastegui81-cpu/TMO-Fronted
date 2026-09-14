import TaskCard from './TaskCard';

function Column({ title, tasks, onCambiarEstado, onEliminar, onVerDetalle }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          status={task.status}
          created_at={task.created_at}
          onCambiarEstado={onCambiarEstado}
          onEliminar={onEliminar}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
}

export default Column;
