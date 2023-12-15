import React, { useTransition } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { PublishFactory } from '@/actions/factory';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';

function PublishFactoryBtn({id}: {id: number}) {
  const [ loading, startTransition ] = useTransition();
  const router = useRouter();

  async function publishFactory(){
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2">
          <span>P</span>
          Publish
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