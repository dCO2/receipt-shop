import React from 'react'
import useEditor from './hooks/useEditor';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { MdPreview } from 'react-icons/md';
import { FactoryElements } from './FactoryElements';
import { cn } from '@/lib/utils';

function PreviewFactoryBtn({ mobile }: { mobile?: boolean }) {
  const {elements} = useEditor();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={"outline"} 
          className={cn("gap-2", mobile && "h-8 w-8 p-0")}
          size={mobile ? "icon" : "default"}
        >
          <MdPreview className={cn(mobile ? "h-4 w-4" : "h-5 w-5 md:h-6 md:w-6")} />
          {!mobile && <span className="hidden lg:inline">Preview</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Factory preview</p>
          <p className="text-sm text-muted-foreground">This is how your form will look like to your users.</p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {elements.map((element) => {
              const FactoryComponent = FactoryElements[element.type].factoryComponent;

              return <FactoryComponent key={element.id} elementInstance={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewFactoryBtn;