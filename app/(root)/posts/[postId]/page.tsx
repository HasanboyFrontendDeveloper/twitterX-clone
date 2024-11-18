"use client";

import CommentItem from "@/components/shared/comment-item";
import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sliceText } from "@/lib/utils";
import { IPost } from "@/types";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IPost[]>([]);

  const { postId } = useParams();

  const getPost = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/posts/${postId}`);
      setPost(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      setIsFetchingComment(true);
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
      console.log(data);

      setIsFetchingComment(false);
    } catch (error) {
      console.log(error);
      setIsFetchingComment(false);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  return (
    <>
      <Header label="Posts" isBack />

      {isLoading || status === "loading" || post === null ? (
        <div className="flex justify-center items-center h-24 ">
          <Loader2 className="animate-spin text-sky-500 " />
        </div>
      ) : (
        <>
          <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition relative ">
            {isLoading && (
              <div className="absolute inset-0 w-full h-full bg-black opacity-50 ">
                <div className="flex justify-center items-center h-full ">
                  <Loader2 className="animate-spin text-sky-500 " />
                </div>
              </div>
            )}
            <div className="flex flex-row gap-4">
              <Avatar>
                <AvatarImage src={post.user.profileImage} />
                <AvatarFallback className="uppercase">
                  {post.user.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-white cursor-pointer font-semibold hover:underline">
                    {post.user.name}
                  </p>

                  <span className="text-neutral-500 cursor-pointer hidden md:block hover:underline">
                    {post && post.user.username
                      ? `@${sliceText(post.user.username, 20)}`
                      : sliceText(post.user.email, 20)}
                  </span>

                  <span className="text-neutral-500 text-sm ">
                    {formatDistanceToNowStrict(new Date(post.createdAt))} ago
                  </span>
                </div>

                <div className="text-white mt-1 ">{post.body}</div>
              </div>
            </div>
          </div>

          <Form
            placeholder="Post your reply"
            user={JSON.parse(JSON.stringify(session.currentUser))}
            setPosts={setComments}
            postId={post._id}
            isComment
          />

          {isFetchingComment ? (
            <div className="flex justify-center items-center h-24 ">
              <Loader2 className="animate-spin text-sky-500 " />
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentItem
                  comment={comment}
                  comments={comments}
                  key={comment._id}
                  user={JSON.parse(JSON.stringify(session.currentUser))}
                  setComments={setComments}
                />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Page;
