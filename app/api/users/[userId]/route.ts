import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { userId } = await route.params;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "updateImage") {
      await User.findByIdAndUpdate(userId, body, { new: true });
      return NextResponse.json({ message: "User Updated Successfully" });
    } else if (type === "updateFields") {
      const existUser = await User.findById(userId);

      if (existUser.username !== body.username) {
        const usernameExist = await User.exists({ username: body.username });

        if (usernameExist) {
          return NextResponse.json(
            { error: "Username already exist" },
            { status: 400 }
          );
        }
      }

      await User.findByIdAndUpdate(userId, body, { new: true });

      return NextResponse.json({ message: "User Updated Successfully" });
    }
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
