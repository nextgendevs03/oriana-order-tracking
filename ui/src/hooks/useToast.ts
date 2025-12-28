import { App } from "antd";
import { useCallback } from "react";

export interface ToastOptions {
  duration?: number; // milliseconds, 0 = don't auto-dismiss
  description?: string; // Additional description (will be combined with main message)
}

/**
 * Custom hook to use Ant Design message API
 * Uses App.useApp() to access message instance from AntApp context
 *
 * Usage:
 * const toast = useToast();
 * toast.success("Success message");
 * toast.error("Error message");
 */
export const useToast = () => {
  const { message } = App.useApp();

  const success = useCallback(
    (content: string, options?: ToastOptions) => {
      const duration = options?.duration
        ? options.duration / 1000 // Convert milliseconds to seconds
        : 3; // Default 3 seconds

      const messageContent = options?.description
        ? `${content} - ${options.description}`
        : content;

      return message.success(messageContent, duration === 0 ? 0 : duration);
    },
    [message]
  );

  const error = useCallback(
    (content: string, options?: ToastOptions) => {
      const duration = options?.duration
        ? options.duration / 1000 // Convert milliseconds to seconds
        : 5; // Default 5 seconds for errors

      const messageContent = options?.description
        ? `${content} - ${options.description}`
        : content;

      return message.error(messageContent, duration === 0 ? 0 : duration);
    },
    [message]
  );

  const warning = useCallback(
    (content: string, options?: ToastOptions) => {
      const duration = options?.duration
        ? options.duration / 1000 // Convert milliseconds to seconds
        : 5; // Default 5 seconds for warnings

      const messageContent = options?.description
        ? `${content} - ${options.description}`
        : content;

      return message.warning(messageContent, duration === 0 ? 0 : duration);
    },
    [message]
  );

  const info = useCallback(
    (content: string, options?: ToastOptions) => {
      const duration = options?.duration
        ? options.duration / 1000 // Convert milliseconds to seconds
        : 3; // Default 3 seconds

      const messageContent = options?.description
        ? `${content} - ${options.description}`
        : content;

      return message.info(messageContent, duration === 0 ? 0 : duration);
    },
    [message]
  );

  const destroy = useCallback(() => {
    message.destroy();
  }, [message]);

  return {
    success,
    error,
    warning,
    info,
    destroy,
  };
};
