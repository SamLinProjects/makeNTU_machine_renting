//import prisma from ".prisma/client";  
import prisma from "../../../../prisma/client";
import { NextResponse, type NextRequest } from "next/server";

//POST
export async function POST(req: NextRequest) {
    const data = await req.json();
    const { group, type, filename, comment } = data;
    try {
        const user = await prisma.request.create({
            data: {
                group: group,
                type: type,
                filename: filename,
                comment: comment,
                number: 0,
                status:"pending",
            }
        });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log("error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
          );
    }
}

// GET
export async function GET (req: NextRequest) {
    try{
        const dbresultReq = await prisma.request.findMany();
        return NextResponse.json({dbresultReq}, {status: 200});
    }catch(error){
        console.log("error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

//PUT
export async function PUT (req: NextRequest) {
    
    const data = await req.json();
    const {newStatus} = data;
    console.log(newStatus);
    const reqID = data.id;
    try{
      const result = await prisma.request.update({
        where: {
          id: reqID,
        },
        data:{
          status: newStatus,
        }
      })
      return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log("error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
          );
    }
  }