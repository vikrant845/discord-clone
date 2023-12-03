"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/user-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from 'query-string';

export const DeleteChannelModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const [ loading, setLoading ] = useState(false);
    const isModalOpen = isOpen && type === 'deleteChannel';
    const router = useRouter();

    const url = qs.stringifyUrl({
        url: `/api/channels/${ data.channel?.id }`,
        query: {
            serverId: data.server?.id
        }
    });
    
    const onLeave = async () => {
        try {
            setLoading(true);
            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${ data.server?.id }`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Dialog open={ isModalOpen } onOpenChange={ onClose }>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to delete <span className='font-semibol text-indigo-500'>{ data.channel?.name }</span>? This action cannot be reversed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className="flex items-center justify-between w-full">
                        <Button onClick={ onClose } variant='ghost' disabled={ loading }>Cancel</Button>
                        <Button onClick={ onLeave } variant='primary' disabled={ loading }>Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}