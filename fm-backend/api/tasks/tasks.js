import { Mongo } from "meteor/mongo";

export const Tasks = new Mongo.Collection("tasks");

const schema = {
  _id: String,
  text: String,
  checked: Boolean,
  createdAt: Date,
  userId: String,
};

Tasks.attachSchema(schema);
