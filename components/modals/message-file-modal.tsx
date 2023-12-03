"use client";

import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/user-modal-store";
import qs from 'query-string';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Attatchment is required'
    })
});

export const MessageFileModal = () => {
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    });

    const router = useRouter();

    const loading = form.formState.isSubmitting;
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === 'messageFile';

    const handleClose = () => {
        form.reset();
        onClose();
    }
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: data.apiUrl || '',
                query: data.query
            });

            await axios.post(url, { ...values, content: values.fileUrl });
            router.refresh();
            form.reset();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Dialog open={ isModalOpen } onOpenChange={ handleClose }>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Add An Attatchment</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send A File As A Message.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit(onSubmit) } className='space-y-8'>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center text-center justify-center">
                                <FormField
                                    control={ form.control }
                                    name='fileUrl'
                                    render={ ({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload onChange={ field.onChange } value={ field.value } endPoint='messageFile' />
                                            </FormControl>
                                        </FormItem>
                                    ) }
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant='primary' disabled={ loading }>Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}