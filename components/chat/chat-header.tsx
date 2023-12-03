import { Hash, Menu } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import UserAvatar from "@/components/user-avatar";
import SocketIndicator from "@/components/socket-indicator";

interface ChatHeaderProps {
    serverId: string;
    type: 'channel' | 'conversation';
    name: string;
    imageUrl?: string;
}

const ChatHeader = ({ serverId, type, name, imageUrl }: ChatHeaderProps) => {
    return (
        <div className='text-md font-semibold px-3 flex items-center border-neutral-200 h-12 dark:border-neutral-400 border-b-2'>
            <MobileToggle serverId={ serverId } />
            { type === 'channel' && (
                <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />
            ) }
            { type === 'conversation' && (
                <UserAvatar src={ imageUrl } className='h-8 w-8 md:h-8 md:w-8 mr-2' />
            ) }
            <p className='font-semibold text-md text-black dark:text-white'>{ name }</p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    );
}

export default ChatHeader;