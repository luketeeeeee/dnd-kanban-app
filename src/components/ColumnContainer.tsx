import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";

interface Props {
	column: Column;
	deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
	const { column, deleteColumn } = props;

	return (
		<div className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md bg-columnBgColor">
			<div className="text-md flex h-[60px] cursor-grab items-center justify-between rounded-b-none border-4 border-columnBgColor bg-mainBgColor p-3 font-bold">
				<div className="flex gap-2">
					<div className="flex items-center justify-center rounded-full bg-columnBgColor px-2 py-1 text-sm">
						0
					</div>
					{column.title}
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
