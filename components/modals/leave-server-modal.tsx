"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/user-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const [ loading, setLoading ] = useState(false);
    const isModalOpen = isOpen && type === 'leaveServer';
    const router = useRouter();

    const onLeave = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/servers/${ data.server?.id }/leave`);
            router.refresh();
            onClose();
            router.push('/');
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
                    <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to leave <span className='font-semibol text-indigo-500'>{ data.server?.name }</span>?
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