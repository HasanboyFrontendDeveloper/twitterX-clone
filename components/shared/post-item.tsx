"use client";

import { IPost, IUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { AiFillDelete, AiOutlineMessage } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  post: IPost;
  user: IUser;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
}

const PostItem = ({ post, user, setPosts }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onDelete = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      setIsLoading(true);
      const { data } = await axios.delete("/api/posts", {
        data: {
          postId: post._id,
        },
      });

      setPosts((prev) => prev.filter((item) => item._id !== post._id));
      setIsLoading(false);

      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      setIsLoading(false);

      return toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onLike = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      setIsLoading(true);

      if (post.hasLiked) {
        // DELETE LIKE
        await axios.delete("/api/likes", {
          data: { postId: post._id, userId: user._id },
        });

        const updatedPost = {
          ...post,
          hasLiked: false,
          likes: post.likes - 1,
        };

        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? updatedPost : p))
        );
      } else {
        // ADD LIKE
        await axios.put("/api/likes", {
          postId: post._id,
          userId: user._id,
        });

        const updatedPost = {
          ...post,
          hasLiked: true,
          likes: post.likes + 1,
        };

        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? updatedPost : p))
        );
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      return toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const goToPost = () => {
    router.push(`/posts/${post._id}`);
  };

  const goToProfile = (evt: any) => {
    evt.stopPropagation();
    router.push(`/profile/${post.user._id}`);
  };

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative ">
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50 ">
          <div className="flex justify-center items-center h-full ">
            <Loader2 className="animate-spin text-sky-500 " />
          </div>
        </div>
      )}
      <div className="flex flex-row gap-4" onClick={goToPost}>
        <Avatar onClick={goToProfile}>
          <AvatarImage src={post.user.profileImage} />
          <AvatarFallback className="uppercase">
            {post.user.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="">
          <div className="flex flex-row items-center gap-2">
            <p
              className="text-white cursor-pointer font-semibold hover:underline"
              onClick={goToProfile}
            >
              {post.user.name}
            </p>

            <span
              className="text-neutral-500 cursor-pointer hidden md:block hover:underline"
              onClick={goToProfile}
            >
              {post.user.username
                ? `@${sliceText(post.user.username, 20)}`
                : sliceText(post.user.email, 20)}
            </span>

            <span className="text-neutral-500 text-sm ">
              {formatDistanceToNowStrict(new Date(post.createdAt))} ago
            </span>
          </div>

          <div className="text-white mt-1 ">{post.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10 ">
            <div className="flex flex-row items-center gap-2 text-neutral-500 cursor-pointer hover:text-sky-500 transition ">
              <AiOutlineMessage size={20} />
              <p>{post.comments || 0}</p>
            </div>

            <div
              className="flex flex-row items-center gap-2 text-neutral-500 cursor-pointer hover:text-red-500 transition "
              onClick={onLike}
            >
              <FaHeart size={20} color={post.hasLiked ? "red" : ""} />
              <p>{post.likes || 0}</p>
            </div>

            {post.user._id === user._id && (
              <div
                className="flex flex-row items-center gap-2 text-neutral-500 cursor-pointer hover:text-red-500 transition  "
                onClick={onDelete}
              >
                <AiFillDelete size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
