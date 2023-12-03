import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await CurrentProfile();

    if (!profile) return redirectToSignIn();
    
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        }
    });
    
    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    });

    if (!member || !channel) redirect('/');
    
    return (
        <div className="bg-white flex flex-col h-full dark:bg-[#313338]">
            <ChatHeader name={ channel.name } serverId={ params.serverId } type='channel' />
            <ChatMessages
                member={ member }
                name={ channel.name }
                chatId={ channel.id }
                type='channel'
                apiUrl='/api/messages'
                socketUrl='/api/socket/messages'
                socketQuery={{
                    serverId: channel.serverId,
                    channelId: channel.id
                }}
                paramKey='channelId'
                paramValue={ channel.id }
            />
            <ChatInput
                name={ channel.name }
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId
                }}
                type='channel'
                apiUrl='/api/socket/messages'
            />
        </div>
    );
}

export default ChannelIdPage;