"use client";

import { IUser } from "@/types";
import React, { useState } from "react";
import Button from "../ui/button";
import { IoLocationSharp } from "react-icons/io5";
import { BiCalendar } from "react-icons/bi";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditModal from "../modals/edit-modal";
import useEditModal from "@/hooks/useEditModal";
import Modal from "../ui/modal";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import User from "../shared/user";
import Link from "next/link";

const ProfileBio = ({ user, userId }: { user: IUser; userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [state, setState] = useState<string>("following");

  const editModal = useEditModal();
  const router = useRouter();

  const onFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put("/api/follows", {
        userId: user._id,
        currentUserId: userId,
      });

      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUnfollow = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/follows", {
        data: { userId: user._id, currentUserId: userId },
      });

      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getFollowUser = async (userId: string, type: string) => {
    try {
      setOpen(true);
      setIsFetching(true);

      const { data } = await axios.get(
        `/api/follows?userId=${userId}&state=${type}`
      );
      setIsFetching(false);
      return data;
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  };

  // const openFollowModal = async (type: string) => {
  //   try {
  //     setOpen(true);
  //     setState(type);
  //     const data = await getFollowUser(user._id, type);
  //     if (type === "following") {
  //       setFollowing(data);
  //     } else if (type === "followers") {
  //       setFollowers(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setIsFetching(false);
  //   }
  // };

  const onFollowing = async () => {
    setOpen(true);
    setState("following");

    if (following.length === 0) {
      const data = await getFollowUser(user._id, "following");
      setFollowing(data);
    }
  };

  const onFollowers = async () => {
    setOpen(true);
    setState("followers");

    if (followers.length === 0) {
      const data = await getFollowUser(user._id, "followers");
      setFollowers(data);
    }
  };

  const onChangeFollowing = async (following: IUser[]) => {
    setFollowing(following);

    const followingData = await getFollowUser(user._id, "following");
    setFollowing(followingData);

    const followersData = await getFollowUser(user._id, "followers");
    setFollowers(followersData);
  };

  return (
    <>
      <EditModal user={user} />
      <div className="border-b-[1px] border-neutral-800 pb-4">
        <div className="flex justify-end p-2">
          {userId === user._id ? (
            <Button label="Edit Profile" secondary onClick={editModal.onOpen} />
          ) : (
            <>
              {user.isFollowing ? (
                <Button
                  label={"Unfollow"}
                  disabled={isLoading}
                  onClick={onUnfollow}
                  outline
                />
              ) : (
                <Button
                  label={"Follow"}
                  disabled={isLoading}
                  onClick={onFollow}
                />
              )}
            </>
          )}
        </div>

        <div className="mt-8 px-4">
          <div className="flex flex-col">
            <p className="text-white text-2xl font-semibold">{user.name}</p>
          </div>

          <p className="text-md text-neutral-500">
            {user.username ? `@${user.username}` : user.email}
          </p>

          <div className="flex flex-col mt-4 ">
            <p className="text-white">{user.bio}</p>
            <div className="flex gap-4 items-center ">
              {user.location && (
                <div className="flex flex-row items-center gap-2 mt-4 text-sky-500 ">
                  <IoLocationSharp size={24} />
                  <p>{user.location}</p>
                </div>
              )}

              <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500 ">
                <BiCalendar size={24} />
                <p>
                  Joined {formatDistanceToNowStrict(new Date(user.createdAt))}{" "}
                  ago
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center mt-6 gap-6">
              <div
                className="flex flex-row items-center gap-1 hover:underline cursor-pointer"
                // onClick={() => openFollowModal("following")}
                onClick={onFollowing}
              >
                <p className="text-white">{user.following}</p>
                <p className="text-neutral-500">Following</p>
              </div>

              <div
                className="flex flex-row items-center gap-1 hover:underline cursor-pointer"
                // onClick={() => openFollowModal("followers")}
                onClick={onFollowers}
              >
                <p className="text-white">{user.followers}</p>
                <p className="text-neutral-500">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        body={
          <>
            <div className="flex flex-row w-full py-3 px-4 ">
              <div
                className={cn(
                  "w-[50%] h-full flex justify-center items-center cursor-pointer font-semibold transition-colors ",
                  state === "following" &&
                    "border-b-[2px] border-sky-500 text-sky-500  "
                )}
                onClick={onFollowing}
              >
                Following
              </div>
              <div
                className={cn(
                  "w-[50%] h-full flex justify-center items-center cursor-pointer font-semibold transition-colors ",
                  state === "followers" &&
                    "border-b-[2px] border-sky-500 text-sky-500  "
                )}
                onClick={onFollowers}
              >
                Followers
              </div>
            </div>

            {isFetching ? (
              <div className="flex justify-center items-center h-24 ">
                <Loader2 className="animate-spin text-sky-500 " />
              </div>
            ) : (
              <div className="flex flex-col space-y-4 ">
                {state === "following" ? (
                  following.length === 0 ? (
                    <div className="text-neutral-600 text-center p-6 text-xl ">
                      No Following
                    </div>
                  ) : (
                    following.map((user) => (
                      <Link href={`/profile/${user._id}`} key={user._id}>
                        <User
                          user={user}
                          isFollow
                          following={following}
                          onChangeFollowing={onChangeFollowing}
                        />
                      </Link>
                    ))
                  )
                ) : followers.length === 0 ? (
                  <div className="text-neutral-600 text-center p-6 text-xl ">
                    No Followers
                  </div>
                ) : (
                  followers.map((user) => (
                    <Link href={`profile/${user._id}`} key={user._id}>
                      <User
                        user={user}
                        isFollow
                        following={following}
                        onChangeFollowing={onChangeFollowing}
                      />
                    </Link>
                  ))
                )}
              </div>
            )}
          </>
        }
      />
    </>
  );
};

export default ProfileBio;
