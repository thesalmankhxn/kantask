import {CheckIcon, XIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {flushSync} from "react-dom";
import {Button} from "@/components/ui/button";
import {useInteractiveOutside} from "@/hooks/use-interactive-outside";
import {cn} from "@/lib/utils";

export function EditableText({
  fieldName,
  inputClassName,
  inputLabel,
  buttonClassName,
  defaultValue,
  defaultMode = "view",
  onSubmit,
}: {
  fieldName: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName?: string;
  defaultMode?: "edit" | "view";
  defaultValue: string;
  onSubmit: (value: string) => Promise<void> | void;
}) {
  const [edit, setEdit] = useState(defaultMode === "edit");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (defaultMode === "edit") {
      inputRef.current?.select();
    }
  }, []);

  useInteractiveOutside(formRef, () => {
    setEdit(false);
  });

  return edit ? (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(inputRef.current?.value ?? "");
        flushSync(() => {
          setEdit(false);
        });
        defaultMode !== "edit" && buttonRef.current?.focus();
      }}
      className="flex gap-3 w-full"
      ref={formRef}
    >
      <div className="flex-1">
        <input
          required
          ref={inputRef}
          type="text"
          defaultValue={defaultValue}
          aria-label={inputLabel}
          name={fieldName}
          className={cn("w-full p-2 rounded-lg bg-muted", inputClassName)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              flushSync(() => {
                setEdit(false);
              });
              buttonRef.current?.focus();
            }

            if (event.key === "e") {
              event.stopPropagation();
            }
          }}
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="icon"
          type="button"
          variant="outline"
          className="hover:border-red-8 hover:text-red-9 hover:bg-red-4 active:bg-red-5"
          onClick={() => setEdit(false)}
        >
          <XIcon className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          type="submit"
          variant="outline"
          className="hover:border-green-8 hover:text-green-9 hover:bg-green-4 active:bg-green-5"
        >
          <CheckIcon className="w-4 h-4" />
        </Button>
      </div>
    </form>
  ) : (
    <button
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
      className={cn("w-full text-left p-2 rounded-lg", buttonClassName)}
    >
      {defaultValue}
    </button>
  );
}
