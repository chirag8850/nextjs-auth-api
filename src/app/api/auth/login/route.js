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
    // Set CORS headers
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', 'http://localhost:4200'); // Replace with your frontend origin
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { status: 200, headers: responseHeaders });
    }

    const body = await request.json();
    const validator = vine.compile(loginSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // Check if the email exists
    const user = await User.findOne({ email: output.email });
    if (user) {
      const checkPassword = await bcrypt.compare(output.password, user.password);
      if (checkPassword) {
        return NextResponse.json(
          { message: "User Logged In" },
          { status: 200, headers: responseHeaders }
        );
      }
      return NextResponse.json(
        { message: "Please check your password" },
        { status: 400, headers: responseHeaders }
      );
    } else {
      return NextResponse.json(
        { message: "Email does not exist" },
        { status: 400, headers: responseHeaders }
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(error.messages, { status: 400, headers: responseHeaders });
    }
    return NextResponse.json({ error: error.message }, { status: 500, headers: responseHeaders });
  }
}
