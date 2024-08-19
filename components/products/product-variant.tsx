import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ProductVariantSchema } from "@/types/product-variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { InputTags } from "./input-tags";
import { useEffect, useState } from "react";
import { createVariant } from "@/db/actions/create-variant";
import { toast } from "sonner";
import { VariantsWithImagesTags } from "@/lib/infer-type-variants";
import VariantImages from "./variant-image";
import { deleteVariant } from "@/db/actions/delete-variant";

export default function ProductVariant({
  productID,
  variant,
  editMode,
  children,
}: {
  productID?: number;
  variant?: VariantsWithImagesTags;
  editMode: boolean;
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof ProductVariantSchema>>({
    resolver: zodResolver(ProductVariantSchema),
    defaultValues: {
      productID,
      id: undefined,
      editMode,
      productType: "Black Notebook",
      color: "#0000",
      tags: [],
      variantImages: [],
    },
  });

  const [open, setOpen] = useState(false);

  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productID", variant.productID);
      form.setValue("productType", variant.productType);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }))
      );
    }
  };

  useEffect(() => {
    setEdit();
  }, [variant]);

  const { execute, status } = useAction(createVariant, {
    onExecute() {
      toast.loading("Creating variant", { duration: 1 });
      setOpen(false);
    },
    onSuccess(data) {
      if (data?.data?.error) {
        toast.error(data.data?.error);
      }
      if (data?.data?.success) {
        toast.success(data.data?.success);
      }
    },
  });

  const deleteVariantAction = useAction(deleteVariant, {
    onExecute() {
      toast.loading("Deleting variant", { duration: 1 });
      setOpen(false);
    },
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data?.success);
      }
    },
  });

  function onSubmit(values: z.infer<typeof ProductVariantSchema>) {
    execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[800px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>Manage your product variants </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  variant={"destructive"}
                  type="button"
                  disabled={deleteVariantAction.status === "executing"}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteVariantAction.execute({ id: variant.id });
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
