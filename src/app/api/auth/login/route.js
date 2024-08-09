import { connectDb } from "@/database/dbconfig";
import { NextResponse } from "next/server";
import vine, { errors } from "@vinejs/vine";
import { loginSchema } from "@/validator/authSchema";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";
import { User } from "@/model/User";
connectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const validator = vine.compile(loginSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // check email exist
    const user = await User.findOne({ email: output.email });
    if (user) {
      const checkPassword = bcrypt.compareSync(output.password, user.password);
      if (checkPassword) {
        return NextResponse.json(
          {
            message: "User Logged In",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          message: "Please Check your password",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Email Not Exist",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(error.messages, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
