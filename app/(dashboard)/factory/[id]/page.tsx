import { GetFactoryById, GetFactoryPrintedReceipts } from "@/actions/factory";
import React, { ReactNode } from "react";
import { StatsCard } from "../../page";
import { EyeIcon } from "@heroicons/react/24/outline";
import VisitFactoryBtn from "@/components/VisitFactoryBtn";
import FactoryLinkShare from "@/components/FactoryLinkShare";
import { ElementType, FactoryElementInstance } from "@/components/FactoryElements";
import { format, formatDistance } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default FactoryDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function PrintsList({id}:{id: number}){
  const factory = await GetFactoryPrintedReceipts(id);

  if(!factory){
    throw new Error("Cannot find factory!");
  }

  const factoryElements = JSON.parse(factory.content) as FactoryElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementType;
  }[] = [];

  factoryElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  factory.printedReceipts.forEach((print) => {
    const content = JSON.parse(print.content);
    rows.push({
      ...content,
      submittedAt: print.createdAt,
    });
  });

  return(
    <div>
      <h1 className="text-2xl font-bold my-4">Prints</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Printed at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell key={column.id} type={column.type} value={row[column.id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowCell({ type, value }: { type: ElementType; value: string }) {
  let node: ReactNode = value;
  
  return <TableCell>{node}</TableCell>;
}