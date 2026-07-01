import { getErrorMessage, getSuccessMessage } from "@/lib/flash";

interface FlashMessagesProps {
  success?: string;
  error?: string;
}

export function FlashMessages({ success, error }: FlashMessagesProps) {
  const successMsg = getSuccessMessage(success);
  const errorMsg = getErrorMessage(error);

  if (!successMsg && !errorMsg) return null;

  return (
    <>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
    </>
  );
}
