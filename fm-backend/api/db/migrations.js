import { Migrations } from "meteor/quave:migrations";
import { Accounts } from "meteor/accounts-base";
import { Tasks } from "../tasks/tasks";

Migrations.add({
  version: 1,
  name: "Add a seed username and password.",
  async up() {
    await Accounts.createUserAsync({
      username: "fredmaia",
      password: "abc123",
    });
  },
});

Migrations.add({
  version: 2,
  name: "Add a few sample tasks.",
  async up() {
    const user = await Accounts.findUserByUsername("fredmaia");
    await Tasks.insertAsync({
      text: "Install Node@20",
      checked: false,
      userId: user._id,
      createdAt: new Date(2024, 1, 1),
    });
    await Tasks.insertAsync({
      text: "Install Meteor.js 3.0",
      checked: false,
      userId: user._id,
      createdAt: new Date(2024, 1, 2),
    });
    await Tasks.insertAsync({
      text: "Clone this repository",
      checked: false,
      userId: user._id,
      createdAt: new Date(2024, 1, 3),
    });
  },
});
