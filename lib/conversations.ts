import { db } from "@/lib/db"

export const findOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversations(memberOneId, memberTwoId) || await findConversations(memberTwoId, memberOneId);

    if (!conversation) conversation = await createConversation(memberOneId, memberTwoId);

    return conversation;
}

const findConversations = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch (error) {
        return null;
    }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch(error) {
        return null;
    }
}