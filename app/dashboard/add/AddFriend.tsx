"use client";

import Button from "@/components/ui/Button";
import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type em = z.infer<typeof emailSchema>;

const AddFriend = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<em>({ resolver: zodResolver(emailSchema) });

  const [isSending, setSending] = useState(false);

  return (
    <div>
      <form
        className="max-w-sm mt-8"
        onSubmit={handleSubmit(async (data, event) => {
          event?.preventDefault();
          setSending(true);

          const validate = emailSchema.safeParse(data);
          if (!validate.success) {
            toast.error("Something went wrong");
            setSending(false);
            return;
          }

          try {
            const res = await axios.post("/api/friend/add", data);

            toast.success(res.data.message);
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data.message);
            } else {
              toast.error("Something went wrong.");
            }
          }
          setSending(false);
        })}
      >
        <label htmlFor="email" className="text-sm text-gray-900">
          Add a friend by email
        </label>

        <div className="flex gap-3 mt-3">
          <input
            {...register("email")}
            type="text"
            id="email"
            placeholder="user@example.com"
            className="border-0 border-gray-400 rounded-md px-3 py-[6px] outline-none text-gray-900 w-full shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <Button
            className="text-nowrap"
            variant="gradient"
            type="submit"
            isLoading={isSending}
          >
            Send Request
          </Button>
        </div>
        {errors.email && (
          <p className="m-1 text-xs text-red-500 tracking-tight">
            {errors.email.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddFriend;
