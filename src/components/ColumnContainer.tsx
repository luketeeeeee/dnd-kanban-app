import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Props {
	column: Column;
	deleteColumn: (id: Id) => void;
	updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer(props: Props) {
	const { column, deleteColumn, updateColumn } = props;

	const [editMode, setEditMode] = useState(false);

	// hook do sortable
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
		useSortable({
			id: column.id,
			data: {
				type: "Column",
				column,
			},
		});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	// isDraggin vem do hook e verifica se tá sendo holdado
	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-rose-400 bg-columnBgColor opacity-80"
			></div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md bg-columnBgColor"
		>
			<div
				// isso serve pra poder alterar a ordem das colunas (não necessário no meu caso)
				{...attributes}
				{...listeners}
				onClick={() => setEditMode(true)}
				className="text-md flex h-[60px] cursor-grab items-center justify-between rounded-b-none border-4 border-columnBgColor bg-mainBgColor p-3 font-bold"
			>
				<div className="flex gap-2">
					<div className="flex items-center justify-center rounded-full bg-columnBgColor px-2 py-1 text-sm">
						0
					</div>
					{!editMode && column.title}
					{editMode && (
						<input
							value={column.title}
							onChange={(e) => updateColumn(column.id, e.target.value)}
							autoFocus
							onBlur={() => setEditMode(false)}
							onKeyDown={(e) => {
								if (e.key !== "Enter") return;
								setEditMode(false);
							}}
							className="rounded border bg-black px-2 outline-none focus:border-rose-500"
						/>
					)}
				</div>

				<button
					onClick={() => {
						deleteColumn(column.id);
					}}
					className="rounded stroke-gray-500 px-1 py-2 hover:bg-columnBgColor hover:stroke-white"
				>
					<TrashIcon />
				</button>
			</div>

			<div className="flex flex-grow">content</div>

			<div>footer</div>
		</div>
	);
}

export default ColumnContainer;
