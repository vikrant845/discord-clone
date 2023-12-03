import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await CurrentProfile();
        const { searchParams } = new URL(req.url);
        const channelId = searchParams.get('channelId');
        const cursor = searchParams.get('cursor');

        if (!profile) return new NextResponse('Unauthorized', { status: 401 });
        if (!channelId) return new NextResponse('ChannelId Missing', { status: 400 });
        
        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor!
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) nextCursor = messages[MESSAGES_BATCH - 1].id;
        return NextResponse.json({
            items: messages,
            nextCursor
        });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}