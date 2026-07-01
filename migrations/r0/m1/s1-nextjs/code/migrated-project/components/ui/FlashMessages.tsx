import { getFlashMessage } from "@/lib/flash-messages";

export function FlashMessages({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  return (
    <>
      {success && (
        <div className="alert alert-success">{getFlashMessage("success", success)}</div>
      )}
      {error && (
        <div className="alert alert-danger">{getFlashMessage("error", error)}</div>
      )}
    </>
  );
}
