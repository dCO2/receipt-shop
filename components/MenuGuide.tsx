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
        <p>
          <div className="text-sm text-muted-foreground">
            Receit-Shop: Make factories to print receipts!
          </div>
        </p>
        <hr/>
        <h3>How to Use</h3>
        <p>
          <div className="text-sm">
            <ol className="list-outside list-decimal pl-5 text-muted-foreground">
              <li>Create an account. (Authentication is powered by Clerk. You're assured secure data)</li>
              <li>Build how your receipt should look. This is called a factory. Drag-and-drop necessary features into your factory</li>
              <li>Publish your factory</li>
              <li>Share the link to your published factory so anyone can print a receipt</li>
            </ol>
          </div>
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default MenuGuide;