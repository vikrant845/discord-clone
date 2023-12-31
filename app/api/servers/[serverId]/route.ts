import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

    try {
        const { name, imageUrl } = await req.json();
    
        const profile = await CurrentProfile();

        if (!profile) return new NextResponse('User not found', { status: 401 });
        
        if (!params.serverId) return new NextResponse('Server Id Missing', { status: 400 });

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE (req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await CurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });
        if (!params.serverId) return new NextResponse('Server ID Missing', { status: 400 });

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}