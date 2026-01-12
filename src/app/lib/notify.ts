// lib/notify.ts
import { notifications } from "@mantine/notifications";

export const notifyError = (message: string) =>
  notifications.show({
    title: "Error",
    message,
    color: "red",
  });

export const notifySuccess = (message: string) =>
  notifications.show({
    title: "Success",
    message,
    color: "green",
    variant: "filled",
  });
