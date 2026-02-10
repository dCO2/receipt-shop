import { GetFactoryContentByUrl } from "@/actions/factory";
import { FactoryElementInstance } from "@/components/FactoryElements";
import FactoryPrint from "@/components/FactoryPrint";
import React from "react";

/*
factory-print page prints unique user receipts. it returns the factory-print
function component which aggregates the individual values in each factory-element
*/

async function PrintPage({
  params,
}: {
  params: {
    factoryUrl: string;
  };
}) {
  // obtain the list of elements from a published factory using server actions;
  const factory = await GetFactoryContentByUrl(params.factoryUrl);

  if (!factory) {
    throw new Error("factory not found");
  }

  const factoryContent = JSON.parse(factory.content) as FactoryElementInstance[];

  return (
    <FactoryPrint
      factoryUrl={params.factoryUrl}
      factoryContent={factoryContent}
      factoryName={factory.name}
    />
  );
}

export default PrintPage;
