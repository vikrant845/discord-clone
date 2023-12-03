"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/user-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {

    const { isOpen, onClose, type, data, onOpen } = useModal();
    const [ copied, setCopied ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const isModalOpen = isOpen && type === 'invite';
    const origin = useOrigin();
    
    const inviteUrl = `${ origin }/invite/${ data.server?.inviteCode }`;

    const onNew = async () => {
        try {
            const server = await axios.patch(`/api/servers/${ data.server?.id }/invite-code`);
            setLoading(true);
            onOpen('invite', { server: server.data });
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }
    
    return (
        <Dialog open={ isModalOpen } onOpenChange={ onClose }>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={ inviteUrl } disabled={ loading } />
                        <Button size='icon' onClick={ onCopy } disabled={ loading }>
                            { copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' /> }
                        </Button>
                    </div>
                    <Button size='sm' variant='link' className='text-xs text-zinc-500 mt-4' disabled={ loading } onClick={ onNew }>
                        Generate New Link
                        <RefreshCw className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}