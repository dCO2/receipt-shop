import { GetFactoryById } from "@/actions/factory";
import React from "react";
import EditFactory from "@/components/EditFactory";

async function EditFactoryPage(
  {params}: {params:
    {
      id: string;
    };
  }){
    const {id} = params;
    const factory = await GetFactoryById(Number(id));

    if(!factory){
      throw new Error("");
    }

    return <EditFactory factory={factory}/>
}

export default EditFactoryPage;