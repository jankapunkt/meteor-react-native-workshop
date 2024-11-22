import { Mongo } from "meteor/mongo";

export const TasksCollection = new Mongo.Collection("tasks");

TasksCollection.schema = {
  text: String,
  userId: String,
  checked: Boolean,
  createdAt: Date,
};

TasksCollection.attachSchema(TasksCollection.schema);
