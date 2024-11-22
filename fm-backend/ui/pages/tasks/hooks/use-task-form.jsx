import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function useTaskForm() {
  const toast = useToast();
  const schema = z.object({
    text: z.string().min(1, "Task text is required"),
  });

  const { handleSubmit, register, reset, formState } = useForm({
    resolver: zodResolver(schema),
  });

  async function saveTask(values) {
    const text = values.text.trim();
    try {
      await Meteor.callAsync("insertTask", { text });
      reset();
    } catch (err) {
      const reason = err?.reason || "Sorry, please try again.";
      toast({
        title: "An error occurred.",
        description: reason,
        status: "error",
      });
    }
  }

  return {
    saveTask,
    register,
    formState,
    handleSubmit,
  };
}
