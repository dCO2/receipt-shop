import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div class="grid grid-rows-3 grid-flow-col gap-4">
      <SignIn class="row-start-1 row-end-4"/>
      <div class="row-start-1 row-end-4">
        Hello
      </div>
    </div>
  );
}
