import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([]);
	const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);

	// pelo que eu entendi isso permite diferenciar um click normal de um drag
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	);

	// FUNÇÕES DE CRUD
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
	}

	function updateColumn(id: Id, title: string) {
		const newColumns = columns.map((column) => {
			if (column.id !== id) return column;
			return { ...column, title };
		});

		setColumns(newColumns);
	}

	// FUNÇÕES PARA DRAG AND DROP
	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}
	}

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeColumnId = active.id;
		const overColumnId = over.id;

		if (activeColumnId === overColumnId) return;

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex(
				(column) => column.id === activeColumnId
			);

			const overColumnIndex = columns.findIndex((column) => column.id === overColumnId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});
	}

	return (
		<div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
			{/* envolve toda a parte de dnd com o DndContext */}
			<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
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
