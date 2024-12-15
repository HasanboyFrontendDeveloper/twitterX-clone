import Notification from "@/database/notification.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();

    const { userId } = await route.params;

    const notifications = await Notification.find({
      user: userId,
    })
      .populate({
        path: "user",
        model: User,
        select: "name username _id profileImage email",
      })
      .sort({ createdAt: -1 });

    const filteredNotifications = notifications.map((notification) => ({
      body: notification.body,
      user: {
        _id: notification.user._id,
        name: notification.user.name,
        username: notification.user.username,
        profileImage: notification.user.profileImage,
        email: notification.user.email,
      },
      createdAt: notification.createdAt,
      _id: notification._id,
    }));

    await User.findByIdAndUpdate(userId, {
      $set: { hasNewNotifications: false },
    });

    return NextResponse.json(filteredNotifications);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  route: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    const { userId } = route.params;

    await Notification.deleteMany({ user: userId });

    await User.findByIdAndUpdate(
      userId,
      {
        $set: { hasNewNotifications: false },
      },
      { new: true }
    );

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
