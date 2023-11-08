import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([]);
	const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);

	// pelo que eu entendi isso permite diferenciar um click normal de um drag
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	);

	// FUNÇÕES DE CRUD COLUMNS
	function createNewColumn() {
		const columnToAdd: Column = {
			id: Math.floor(Math.random() * 10001),
			title: `Column ${columns.length}`,
		};

		setColumns([...columns, columnToAdd]);
	}

	function deleteColumn(id: Id) {
		const filteredColumn = columns.filter((col) => col.id !== id);
		setColumns(filteredColumn);

		const newTasks = tasks.filter((task) => task.columnId !== id);
		setTasks(newTasks);
	}

	function updateColumn(id: Id, title: string) {
		const newColumns = columns.map((column) => {
			if (column.id !== id) return column;
			return { ...column, title };
		});

		setColumns(newColumns);
	}

	// FUNÇÕES DE CRUD TASKS
	function createTask(columnId: Id) {
		const newTask: Task = {
			id: Math.floor(Math.random() * 10001),
			columnId,
			content: `Task ${tasks.length + 1}`,
		};

		setTasks([...tasks, newTask]);
	}

	function updateTask(id: Id, content: string) {
		const newTasks = tasks.map((task) => {
			if (task.id !== id) return task;
			return { ...task, content };
		});

		setTasks(newTasks);
	}

	function deleteTask(id: Id) {
		const newTasks = tasks.filter((task) => task.id !== id);
		setTasks(newTasks);
	}

	// FUNÇÕES PARA DRAG AND DROP
	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}

		if (event.active.data.current?.type === "Task") {
			setActiveTask(event.active.data.current.task);
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveTask(null);
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex((column) => column.id === activeId);

			const overColumnIndex = columns.findIndex((column) => column.id === overId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";

		if (!isActiveATask) return;

		if (isActiveATask && isOverATask) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);

				// if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
				tasks[activeIndex].columnId = tasks[overIndex].columnId; //trocar isso pela função de atualizar a fase
				// }

				return arrayMove(tasks, activeIndex, overIndex);
			});
		}

		const isOverAColumn = over.data.current?.type === "Column";

		if (isActiveATask && isOverAColumn) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);

				// if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
				tasks[activeIndex].columnId = overId; //trocar isso pela função de atualizar a fase
				// }

				return arrayMove(tasks, activeIndex, activeIndex);
			});
		}
	}

	return (
		<div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
			{/* envolve toda a parte de dnd com o DndContext */}
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>
				<div className="m-auto flex gap-4">
					<div className="flex gap-4">
						{/* envolve o mapping das colunas com o SortableContext */}
						{/* o SortableContext precisa de uma parâmetro, esse parâmetro é o array de ids das colunas */}
						{/* array obtido na linha 10 (seguir exemplo) */}
						<SortableContext items={columnsId}>
							{columns.map((column) => (
								<ColumnContainer
									key={column.id}
									column={column}
									deleteColumn={deleteColumn}
									updateColumn={updateColumn}
									// uma melhor forma de filtrar as tasks por cada coluna
									tasks={tasks.filter((task) => task.columnId === column.id)}
									createTask={createTask}
									updateTask={updateTask}
									deleteTask={deleteTask}
								/>
							))}
						</SortableContext>
					</div>

					<button
						onClick={createNewColumn}
						className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBgColor bg-mainBgColor p-4 ring-rose-500 hover:ring-2"
					>
						<PlusIcon />
						Add column
					</button>
				</div>

				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<ColumnContainer
								column={activeColumn}
								updateColumn={updateColumn}
								deleteColumn={deleteColumn}
								createTask={createTask}
								updateTask={updateTask}
								deleteTask={deleteTask}
								tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
							/>
						)}
						{activeTask && (
							<TaskCard
								task={activeTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	);
}

export default KanbanBoard;
