"use client";

import { ProductSchema } from "@/types/product-schema";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { DollarSign } from "lucide-react";
import Tiptap from "./tip-tap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/db/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/db/actions/get-product";
import { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";

export default function ProductForm() {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.success) {
        const id = parseInt(editMode);
        form.setValue("title", data.success.title);
        form.setValue("description", data.success.description);
        form.setValue("price", data.success.price);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.error) {
        toast.error(data.data?.error);
      }

      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success(data.data.success);
      }
    },
    onExecute: (data) => {
      if (editMode) {
        toast.loading("Editing Product");
      }
      if (!editMode) {
        toast.loading("Creating Product");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    execute(values);
  };
  return (
    <Card className="w-[800px] border-none">
      <CardHeader>
        <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Make changes to existing product"
            : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* title  */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Title here" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description  */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* price  */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <FaRupeeSign
                        size={32}
                        className="p-2 bg-muted rounded-md mr-1"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        {...field}
                        step="1"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
