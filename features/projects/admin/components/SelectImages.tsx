import SelectImages from "@/features/shared/components/SelectImages";
import { UseFormReturn } from "react-hook-form";
import { formSchema as createFormSchema } from "../components/AddProject";
import { formSchema as editFormSchema } from "../components/EditProject";
import { z } from "zod";

type CreateFormSchema = z.infer<typeof createFormSchema>;
type EditFormSchema = z.infer<typeof editFormSchema>;

interface SelectImageProps {
  form: UseFormReturn<CreateFormSchema | EditFormSchema>;
  selectedAttachments?: File[];
  mode: 'create' | 'edit';
}

export default function ProjectSelectImages({
  form,
  selectedAttachments = [],
  mode
}: SelectImageProps) {
  return (
    <SelectImages
      form={form}
      fieldName="attachments"
      selectedAttachments={selectedAttachments}
      mode={mode}
      isRequired={mode === 'create'}
    />
  );
}