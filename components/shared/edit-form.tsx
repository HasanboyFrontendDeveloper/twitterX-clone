import { userSchema } from "@/lib/validation";
import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Button from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import useEditModal from "@/hooks/useEditModal";
import { toast } from "@/hooks/use-toast";

interface Props {
  user: IUser;
}

const EditForm = ({ user }: Props) => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      location: user.location || "",
    },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();
  const editModal = useEditModal();

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      await axios.put(`/api/users/${user._id}?type=updateFields`, values);

      router.refresh();
      editModal.onClose();

      toast({
        title: "Success",
        description: "User Successfully Updated",
        variant: "default",
      });
    } catch (error: any) {
      if (error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong, Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 -top-8 mx-4 relative"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Bio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          label="Save"
          large
          fullWidth
          secondary
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default EditForm;