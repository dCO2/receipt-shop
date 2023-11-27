import React, { useTransition } from 'react'
import useEditor from './hooks/useEditor'
import { UpdateFactoryContent } from '@/actions/factory';
import { Button } from './ui/button';

function SaveFactoryBtn({id}: {id: number}) {
  const { elements } = useEditor();
  const [ loading, startTransition ] = useTransition();
  
  const updateFactoryContent = async () => {
    try {
      const ElementsJson = JSON.stringify(elements);
      await UpdateFactoryContent(id, ElementsJson);
      // todo: build toast
      // toast({
      //   title: "Success",
      //   description: "Factory successfully saved",
      // });
    } catch (error) {
      // todo: build toast
      // toast({
      //   title: "Error",
      //   description: "Something went wrong",
      //   variant: "destructive",
      // });
    }
  }
  return (
    <Button variant={"outline"} disabled={loading} onClick={() => {startTransition(updateFactoryContent);}}>
      <span>+</span>
      Save
      {loading && <span>spinnin</span>}
    </Button>
  )
}

export default SaveFactoryBtn