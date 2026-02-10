import React, { useState, useTransition } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { PublishFactory } from '@/actions/factory';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';
import useEditor from './hooks/useEditor';
import { validateElementsForPublish } from './FactoryElements';

const VALIDATION_ERROR_DISPLAY_MS = 4000;

function PublishFactoryBtn({id}: {id: number}) {
  const [ loading, startTransition ] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { elements, setValidationErrors } = useEditor();

  async function publishFactory(){
    // validate that all fields have been configured beyond placeholder defaults
    const invalidIds = validateElementsForPublish(elements);
    if (invalidIds.size > 0) {
      setOpen(false);
      setValidationErrors(invalidIds);
      toast({
        title: "Cannot publish",
        description: "Please update all highlighted fields before publishing",
        variant: "destructive",
      });
      // auto-clear warnings after timeout
      setTimeout(() => setValidationErrors(new Set()), VALIDATION_ERROR_DISPLAY_MS);
      return;
    }

    setOpen(false);

    try {
      await PublishFactory(id);
      toast({
        title: "Success",
        description: "Factory successfully published",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="gap-2">
          <span>P</span>
          <span className="hidden lg:visible">Publish</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing, you will not be able to edit this factory. <br />
            <br />
            <span className="font-medium">
              By publishing this factory, you will make it available to the public and users will be able to make unique receipts.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishFactory);
            }}
          >
            Proceed {loading && <span>spin</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFactoryBtn;