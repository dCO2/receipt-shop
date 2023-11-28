import { GetFactoryById } from "@/actions/factory";
import React from "react";
import { StatsCard } from "../../page";
import { EyeIcon } from "@heroicons/react/24/outline";
import VisitFactoryBtn from "@/components/VisitFactoryBtn";
import FactoryLinkShare from "@/components/FactoryLinkShare";


async function FactoryDetailPage(
  {params}: {params:
    {
      id: string;
    };
  }
){
    
  const {id} = params;
  const factory = await GetFactoryById(Number(id));

  if(!factory){
    throw new Error("factory not found");
  }

  const { visits, prints } = factory;
  let printRate = 0;
  let bounceRate = 0;

  return(
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{factory.name}</h1>
          <VisitFactoryBtn shareUrl={factory.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FactoryLinkShare shareUrl={factory.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total Visits"
          value={visits.toLocaleString() || ""}
          icon={<EyeIcon className="h-7 w-7"/>}
          helperText="All time receipts factory visits"
          loading={false}
          className=""
        />
        
        <StatsCard
          title="Total Prints"
          value={prints.toLocaleString() || ""}
          icon={<EyeIcon className="h-7 w-7"/>}
          helperText="All time receipt factory prints"
          loading={false}
          className=""
        />

        <StatsCard
          title="Print Rate"
          value={printRate.toLocaleString() || ""}
          icon={<EyeIcon className="h-7 w-7"/>}
          helperText="Visits that result in receipt prints"
          loading={false}
          className=""
        />

        <StatsCard
          title="Bounce Rate"
          value={bounceRate.toLocaleString() || ""}
          icon={<EyeIcon className="h-7 w-7"/>}
          helperText="Visits without interaction"
          loading={false}
          className=""
        />
      </div>

      <div className="container pt-10">
        <PrintsList id={factory.id} />
      </div>
    </>
  );
}

function PrintsList({id}:{id: number}){
  return(
    <div>
      List
    </div>
  );
}

export default FactoryDetailPage;