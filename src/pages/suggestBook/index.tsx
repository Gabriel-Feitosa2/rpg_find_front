import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Alltags } from "@/utils/dataTags";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/api";
import { Loader2 } from "lucide-react";

const schema = yup
  .object({
    name: yup.string().required(),
    description: yup.string(),
    tags: yup
      .array()
      .min(1, "You can't leave this blank.")
      .required("You can't leave this blank.")
      .nullable(),
  })

  .required();
type FormData = yup.InferType<typeof schema>;

function SuggestBook() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (body: {
      name: string;
      descripition: string;
      tags: string[];
    }) => {
      await api.post("/books/suggestionBook", body);
    },
  });

  const getAllTags = () => {
    const tags: { value: string; label: string }[] = [];
    Alltags.map((item) => item.tags.map((tag) => tags.push(tag)));
    return tags;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const body = {
      name: data.name,
      descripition: data.description || "",
      tags: data.tags || [],
    };
    mutate(body);
    setValue("name", "");
    setValue("description", "");
    setValue("tags", []);
  };

  return (
    <>
      <div className="p-8 flex justify-center items-center flex-col text-white gap-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-[24rem] flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Name of the RPG"
              className={errors.name ? "border-red-900" : ""}
              {...register("name")}
            />
            <p className="text-red-900">{errors.name?.message}</p>

            <Textarea
              placeholder="Brief description of what the rpg is about"
              className={errors.description ? "border-red-900" : ""}
              {...register("description")}
            />
            <p className="text-red-900">{errors.description?.message}</p>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  {...field}
                  options={getAllTags()}
                  onValueChange={field.onChange}
                  className={errors.tags ? "border-red-900" : ""}
                  value={""}
                  placeholder="Select tags"
                  variant="inverted"
                  animation={2}
                  maxCount={15}
                />
              )}
            />
            <p className="text-red-900">{errors.tags?.message}</p>
            <Button variant="secondary" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SuggestBook;
