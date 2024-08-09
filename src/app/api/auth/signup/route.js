import { connectDb } from "@/database/dbconfig";
import { NextResponse } from "next/server";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "@/validator/authSchema";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";
import { User } from "@/model/User";
connectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const validator = vine.compile(registerSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // check email exist already
    const user = await User.findOne({ email: output.email });
    if (user) {
      return NextResponse.json(
        {
          errors: {
            email: "Email is already Taken",
          },
        },
        { status: 200 }
      );
    } else {
      // encrypt password
      let { name, email, password } = output;
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);
      try {
        const newUser = new User({
          name,
          email,
          password,
        });
        await newUser.save();
        return NextResponse.json({ message: "User Created" }, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { message: "Error Creating User" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json({ errors: error.messages }, { status: 400 });
    }
    return NextResponse.json({ errors: error.message }, { status: 500 });
  }
}
