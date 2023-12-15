import { Bars3Icon } from '@heroicons/react/24/outline'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

function MenuGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-muted border-solid border-white"
          variant={"outline"}
        >
          <Bars3Icon className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        {/* <DialogHeader>
          <DialogTitle>How to Use</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>        
        <DialogFooter>
        </DialogFooter> */}
        <h3>About</h3>
        <p>placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        </p>
        <hr/>
        <h3>How to Use</h3>
        <p>placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        placeholderrrrrrrrrrrrrrrrrrrrrrrrrrrr
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default MenuGuide;