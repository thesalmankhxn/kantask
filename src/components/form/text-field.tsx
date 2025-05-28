import { useFieldContext } from "src/lib/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  label: string;
  type?: "text" | "email" | "password";
  required?: boolean;
  placeholder?: string;
};

export const TextField = ({
  label,
  type = "text",
  required,
  placeholder,
}: Props) => {
  const field = useFieldContext<string>();

  return (
    <Label htmlFor={field.name} className="flex flex-col gap-2 w-full">
      <span className="mr-auto">{label}</span>
      <Input
        name={field.name}
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        type={type}
        placeholder={placeholder ?? ""}
      />
    </Label>
  );
};
