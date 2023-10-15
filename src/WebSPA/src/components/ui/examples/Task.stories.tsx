import { Task } from "./Task";


/*
There are two basic levels of organization in Storybook:
the component and its child stories.
Think of each story as a permutation of a component.
You can have as many stories per component as you need.

Component
 Story
 Story
 Story

*/

/*
https://storybook.js.org/docs/react/api/csf

Use Component Story Format 3 (also known as CSF3 )
to build out each of our test cases.
This format is designed to build out each of our test cases in a concise way.
*/

export default {
	component: Task, // component itself
	title: "Task", // how to group or categorize the component in the Storybook sidebar
	tags: ["autodocs"], // to automatically generate documentation for our components
};

export const Default = {
	args: {
		task: {
			id: "1",
			title: "Test Task",
			state: "TASK_INBOX",
		},
	},
};

export const Pinned = {
	args: {
		task: {
			...Default.args.task,
			state: "TASK_PINNED",
		},
	},
};

export const Archived = {
	args: {
		task: {
			...Default.args.task,
			state: "TASK_ARCHIVED",
		},
	},
};
