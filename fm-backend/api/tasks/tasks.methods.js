import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { checkLoggedIn, checkTaskOwner } from "../lib/auth";
import { Tasks } from "./tasks";

/**

 Inserts a new task into the Tasks collection.
 @async
 @function insertTask
 @param {Object} taskData - The task data.
 @param {string} taskData.text - The text of the task.
 @returns {Promise<string>} - The ID of the inserted task.
 */
async function insertTask({ text }) {
  check(text, String);
  checkLoggedIn();
  const task = {
    text,
    checked: false,
    userId: Meteor.userId(),
    createdAt: new Date(),
  };
  return Tasks.insertAsync(task);
}

/**
 Removes a task from the Tasks collection.
 @async
 @function removeTask
 @param {Object} taskData - The task data.
 @param {string} taskData.taskId - The ID of the task to remove.
 @returns {Promise<number>}
 */
async function removeTask({ taskId }) {
  check(taskId, String);
  await checkTaskOwner({ taskId });
  return Tasks.removeAsync(taskId);
}

/**
 Toggles the 'done' status of a task in the Tasks collection.
 @async
 @function toggleTaskDone
 @param {Object} taskData - The task data.
 @param {string} taskData.taskId - The ID of the task to toggle.
 @returns {Promise<number>}
 */
async function toggleTaskDone({ taskId }) {
  check(taskId, String);
  await checkTaskOwner({ taskId });
  const task = await Tasks.findOneAsync(taskId);
  return Tasks.updateAsync(
    { _id: taskId },
    { $set: { checked: !task.checked } }
  );
}

const getMyTasks = async function () {
  const userId = this.userId;
  checkUser(userId);
  return await Tasks.find({ userId });
};

Meteor.methods({ insertTask, removeTask, toggleTaskDone, getMyTasks });

// Transplanted

/**
 * @module tasks/methods
 */

/**
 * Checks if a user exists by id and throws otherwise
 * @private
 * @param userId {string}
 */
const checkUser = (userId) => {
  if (!userId) {
    throw new NotSignedInError({ userId });
  }
};

/**
 * Creates a new task document
 * @methodOf {tasks/methods}
 * @function
 * @param text {string}
 * @return {string} inserted document _id
 */
export const insertMyTask = async function ({ text }) {
  const userId = this.userId;
  checkUser(userId);
  const checked = false;
  const createdAt = new Date();
  return await Tasks.insertAsync({ text, userId, checked, createdAt });
};

/**
 * Sets checked status for a task
 * @methodOf {tasks/methods}
 * @function
 * @param _id {string}
 * @param checked {boolean}
 * @return {number} 1 if successfull, otherwise 0
 */
export const checkTask = async function ({ _id, checked }) {
  const userId = this.userId;
  checkUser(userId);
  return await Tasks.updateAsync({ _id, userId }, { $set: { checked } });
};

/**
 * Removes a task
 * @methodOf {tasks/methods}
 * @function
 * @param _id {string}
 * @return {number} 1 if successfull, otherwise 0
 */
export const removeMyTask = async function ({ _id }) {
  const userId = this.userId;
  checkUser(userId);
  return await Tasks.removeAsync({ _id, userId });
};
Meteor.methods({
  "tasks.insert": insertMyTask,
  "tasks.setIsChecked": checkTask,
  "tasks.remove": removeMyTask,
});
