"use client";
// import * as Dialog from '@radix-ui/react-dialog';
// import * as Form from '@radix-ui/react-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
          DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CreateFactory } from '@/actions/factory';

import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { CogIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

const factorySchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
})

type factorySchemaType = z.infer<typeof factorySchema>;

function CreateFactoryBtn() {
  
  const form = useForm<z.infer<typeof factorySchema>>({
    resolver: zodResolver(factorySchema),
  });

  async function onSubmit(values: factorySchemaType){
    const factoryId = await CreateFactory(values);
    console.log(factoryId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          {/* <CogIcon className="h-8 w-8"/> */}
          <DocumentPlusIcon className="h-8 w-8"/>
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new factory</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Factory</DialogTitle>
          <DialogDescription>Create a new receipt factory that you might use to make many receipts</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factory Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Create Factory</span>}
            {form.formState.isSubmitting && <span>Spinning</span>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFactoryBtn;