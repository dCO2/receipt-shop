import React, { useTransition } from 'react'
import useEditor from './hooks/useEditor'
import { UpdateFactoryContent } from '@/actions/factory';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

function SaveFactoryBtn({id}: {id: number}) {
  const { elements } = useEditor();
  const [ loading, startTransition ] = useTransition();
  
  const updateFactoryContent = async () => {
    try {
      const ElementsJson = JSON.stringify(elements);
      await UpdateFactoryContent(id, ElementsJson);
      toast({
        title: "Success",
        description: "Factory successfully saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }
  return (
    <Button variant={"outline"} disabled={loading} onClick={() => {startTransition(updateFactoryContent);}} className="gap-2">
      <span>+</span>
      Save
      {loading && <span>spinnin</span>}
    </Button>
  )
}

export default SaveFactoryBtn