export interface IUser {
  createdAt: Date;
  username: string;
  email: string;
  name: string;
  profileImage: string;
  coverImage: string;
  updatedAt: Date;
  _id: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  hasNewNotifications: boolean;
  notifications: string[];
  isFollowing: boolean;
}

export interface IPost {
  body: string;
  comments: number;
  likes: number;
  user: IUser;
  createdAt: string;
  updatedAt: string;
  _id: string;
  hasLiked: boolean;
}
