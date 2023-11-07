// import { SignUp } from "@clerk/nextjs";
import RegisterPage from "../../../register.jsx"

export default function Page() {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4">
      <RegisterPage className="row-start-1 row-end-4"/>
      <div className="row-start-1 row-end-4">
        Hello
      </div>
    </div>
  );
}

