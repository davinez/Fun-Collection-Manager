import type { FunctionComponent } from "shared/types/global.types";

type TTask = {
  id: number,
  title: string,
  state: boolean
}

type TTaskProps = {
	task: TTask,
	onArchiveTask: string,
	onPinTask: boolean
};



export const Task = ({ task, onArchiveTask, onPinTask }: TTaskProps): FunctionComponent => {
  return (
    <div className="list-item">
      <label htmlFor="title" aria-label={task.title}>
        <input type="text" value={task.title} readOnly={true} name="title" />
      </label>
    </div>
  );
}
