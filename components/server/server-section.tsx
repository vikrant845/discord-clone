'use client';

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/user-modal-store";

interface ServerSectionProps {
    label: string;
    sectionType: 'channel' | 'member';
    channelType?: ChannelType;
    role?: MemberRole;
    server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({ server, channelType, sectionType, role, label }: ServerSectionProps) => {

    const { onOpen } = useModal();
    
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                { label }
            </p>
            { role !== MemberRole.GUEST && sectionType === 'channel' && (
                <ActionTooltip label='Create Channel' side='top' align='center'>
                    <button className='text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-400 transition' onClick={ () => onOpen('createChannel', { channelType }) }>
                        <Plus className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            ) }
            { role === MemberRole.ADMIN && sectionType === 'member' && (
                <ActionTooltip label='Manage Members' side='top' align='center'>
                    <button className='text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-400 transition' onClick={ () => onOpen('members', { server }) }>
                        <Settings className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            ) }
        </div>
    );
}

export default ServerSection;