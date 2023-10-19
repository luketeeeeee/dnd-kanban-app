import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([]);

	console.log(columns);

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

	return (
		<div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
			<div className="m-auto flex gap-4">
				<div className="flex gap-4">
					{columns.map((column) => (
						<ColumnContainer
							key={column.id}
							column={column}
							deleteColumn={deleteColumn}
						/>
					))}
				</div>

				<button
					onClick={createNewColumn}
					className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBgColor bg-mainBgColor p-4 ring-rose-500 hover:ring-2"
				>
					<PlusIcon />
					Add column
				</button>
			</div>
		</div>
	);
}

export default KanbanBoard;
