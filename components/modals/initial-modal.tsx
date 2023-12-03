"use client";

import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required'
    }),
    imageUrl: z.string().min(1, {
        message: 'Server image is required'
    })
});

export const InitialModal = () => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    });

    const router = useRouter();

    const loading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const server = await axios.post('/api/servers', values);
            console.log(server);
            router.refresh();
            form.reset();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) return null;
    
    return (
        <Dialog open>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Customize Your Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit(onSubmit) } className='space-y-8'>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center text-center justify-center">
                                <FormField
                                    control={ form.control }
                                    name='imageUrl'
                                    render={ ({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload onChange={ field.onChange } value={ field.value } endPoint='serverImage' />
                                            </FormControl>
                                        </FormItem>
                                    ) }
                                />
                            </div>
                            <FormField
                                control={ form.control }
                                name='name'
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ loading }
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                                placeholder='Enter server name'
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant='primary' disabled={ loading }>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}