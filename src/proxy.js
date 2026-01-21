import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


export async function proxy(req) {
 
   const token = req.cookies.get("token")?.value;
   if(!token) {
      return Response.json(
        { error: "unauthorized" },
        { status: 401 }
      )
   };
  try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-data', JSON.stringify(payload));
      
      return NextResponse.next({
         request: { headers: requestHeaders }
      });

   } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
   }

};


export const config = {
    matcher: [
        "/api/doubts/:path*", 
        "/api/doubts",        
        "/api/answers/:path*",
        "/api/answers",        
        "/api/upload/:path*",
        "/api/upload" 
    ]
}
