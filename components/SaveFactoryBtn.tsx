import React, { useTransition } from 'react'
import useEditor from './hooks/useEditor'
import { UpdateFactoryContent } from '@/actions/factory';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

function SaveFactoryBtn({id, mobile}: {id: number; mobile?: boolean}) {
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
    <Button 
      variant={"outline"} 
      disabled={loading} 
      onClick={() => {startTransition(updateFactoryContent);}} 
      className={cn("gap-2", mobile && "h-8 w-8 p-0")}
      size={mobile ? "icon" : "default"}
    >
      <Save className={cn(mobile ? "h-4 w-4" : "h-4 w-4 md:h-5 md:w-5")} />
      {!mobile && <span className="hidden lg:inline">Save</span>}
      {loading && !mobile && <span className="text-xs">...</span>}
    </Button>
  )
}

export default SaveFactoryBtn