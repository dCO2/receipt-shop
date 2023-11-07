import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4">
      <SignIn className="row-start-1 row-end-4"/>
      <div className="row-start-1 row-end-4">
        This is where receipt-shop should appear. This is where receipt-shop should appear. 
        This is where receipt-shop should appear. This is where receipt-shop should appear. 
        This is where receipt-shop should appear. This is where receipt-shop should appear. 
        This is where receipt-shop should appear. This is where receipt-shop should appear. 
      </div>
    </div>
  );
}
