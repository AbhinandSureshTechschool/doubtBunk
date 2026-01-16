import connectDB from "@/app/lib/db";
import User from "@/app/models/User";


export async function GET() {
    await connectDB();
    const user = await User.find();
    console.log(user, ' : this is user ')
    return Response.json({ message: `These are the user : ${user}`})
}

