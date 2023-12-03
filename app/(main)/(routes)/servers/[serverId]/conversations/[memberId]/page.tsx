import ChatHeader from "@/components/chat/chat-header";
import { findOrCreateConversation } from "@/lib/conversations";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
    const profile = await CurrentProfile();

    if (!profile) return redirectToSignIn();

    const currentMember = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) return redirect('/');

    const conversation = await findOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) return redirect(`/servers/${ params.serverId }`);

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader
                serverId={ params.serverId }
                type='conversation'
                name={ otherMember.profile.name }
                imageUrl={ otherMember.profile.imageUrl }
            />
        </div>
    );
}

export default MemberIdPage;