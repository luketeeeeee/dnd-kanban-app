import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";

interface Props {
	task: Task;
	deleteTask: (id: Id) => void;
}

function TaskCard({ task, deleteTask }: Props) {
	const [mouseIsOver, setMouseIsOver] = useState(false);

	return (
		<div
			onMouseEnter={() => {
				setMouseIsOver(true);
			}}
			onMouseLeave={() => {
				setMouseIsOver(false);
			}}
			className="relative flex h-[80px] min-h-[80px] cursor-grab items-center rounded-xl bg-mainBgColor p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
		>
			{task.content}

			{mouseIsOver && (
				<button
					onClick={() => {
						deleteTask(task.id);
					}}
					className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-columnBgColor stroke-white p-2 opacity-60 hover:opacity-100"
				>
					<TrashIcon />
				</button>
			)}
		</div>
	);
}

export default TaskCard;
