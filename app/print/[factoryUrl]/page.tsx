import { GetFactoryContentByUrl } from "@/actions/factory";
import { FactoryElementInstance } from "@/components/FactoryElements";
import FactoryPrint from "@/components/FactoryPrint";
import React from "react";

async function PrintPage({
  params,
}: {
  params: {
    factoryUrl: string;
  };
}) {
  const factory = await GetFactoryContentByUrl(params.factoryUrl);

  if (!factory) {
    throw new Error("factory not found");
  }

  const factoryContent = JSON.parse(factory.content) as FactoryElementInstance[];

  return <FactoryPrint factoryUrl={params.factoryUrl} factoryContent={factoryContent} />;
}

export default PrintPage;
