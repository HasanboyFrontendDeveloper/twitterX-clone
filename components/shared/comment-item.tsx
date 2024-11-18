"use client";

import { IPost, IUser } from "@/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { AiFillDelete, AiOutlineMessage } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Props {
  comment: IPost;
  comments: IPost[];
  user: IUser;
  setComments: Dispatch<SetStateAction<IPost[]>>;
}

const CommentItem = ({ comment, comments, user, setComments }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.delete(`/api/comments/${comment._id}`);

      setComments((prev) => prev.filter((item) => item._id !== comment._id));

      toast({
        title: "Success",
        description: data.message,
      });

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onLike = async () => {
    try {
      setIsLoading(true);

      if (comment.hasLiked) {
        await axios.delete("/api/comments", {
          data: { commentId: comment._id },
        });

        const updatedComments = comments.map((item) => {
          if (item._id === comment._id) {
            return {
              ...item,
              hasLiked: false,
              likes: item.likes - 1,
            };
          } else {
            return item;
          }
        });

        setComments(updatedComments);
      } else {
        await axios.put("/api/comments", { commentId: comment._id });

        const updatedComments = comments.map((item) => {
          if (item._id === comment._id) {
            return {
              ...item,
              hasLiked: true,
              likes: item.likes + 1,
            };
          } else {
            return item;
          }
        });

        setComments(updatedComments);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const goToPost = () => {};

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
        <Avatar>
          <AvatarImage src={comment.user.profileImage} />
          <AvatarFallback className="uppercase">
            {comment.user.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="">
          <div className="flex flex-row items-center gap-2">
            <p className="text-white cursor-pointer font-semibold hover:underline">
              {comment.user.name}
            </p>

            <span className="text-neutral-500 cursor-pointer hidden md:block hover:underline">
              {comment.user.username
                ? `@${sliceText(comment.user.username, 20)}`
                : sliceText(comment.user.email, 20)}
            </span>

            <span className="text-neutral-500 text-sm ">
              {formatDistanceToNowStrict(new Date(comment.createdAt))} ago
            </span>
          </div>

          <div className="text-white mt-1 ">{comment.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10 ">
            <div
              className="flex flex-row items-center gap-2 text-neutral-500 cursor-pointer hover:text-red-500 transition "
              onClick={onLike}
            >
              <FaHeart size={20} color={comment.hasLiked ? "red" : ""} />
              <p>{comment.likes || 0}</p>
            </div>

            {comment.user._id === user._id && (
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

export default CommentItem;
