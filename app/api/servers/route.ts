import { v4 as uuidv4 } from 'uuid';

import { CurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const user = await CurrentProfile();
        const { name, imageUrl } = await req.json();
        if (!user) return new NextResponse('Unauthorized', { status: 401 });

        const server = await db.server.create({
            data: {
                profileId: user.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: 'general', profileId: user.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: user.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);

    } catch(error) {
        console.log('SERVERS_POST', error);
        return new NextResponse('Internal Server Error', { status: 500});
    }
}