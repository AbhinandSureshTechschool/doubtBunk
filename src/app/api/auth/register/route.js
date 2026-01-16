// Register 

import { registerSchema } from "@/app/lib/validators";

export async function POST(req) {
    try {
        const body = await req.json();

        const parsed = registerSchema.safeParse(body);
        
        if(!parsed.success) {
          return Response.json(
            { error: parsed.error.error[0].message },
            
          )
        }

    } catch (error) {
       return Response.json(
        { error: "Server error" },
        { status: 500 }
       ) 
    }
}