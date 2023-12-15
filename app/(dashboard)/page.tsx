import { GetAllFactoriesStat, GetAllFactories } from "@/actions/factory";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { EyeIcon, EllipsisVerticalIcon, PrinterIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import CreateFactoryBtn from "@/components/CreateFactoryBtn";
import { ReceiptFactory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export default function Home() {
  return(
    <div>
      <Suspense fallback={<StatsBoard loading={true}/>}>
        <StatsBoardWrapper/>
      </Suspense>
      <hr/>
      <div className="flex mt-6 justify-center text-2xl">
        <h2>Existing Factories</h2>
      </div>
      <div className="flex flex-wrap justify-center">
        <FactoryList/>
        {/* <Suspense fallback={<FactoryList/>}>
          <FactoryList/>
        </Suspense> */}
        <CreateFactoryBtn/>
      </div>
      
    </div>
  );
}

async function StatsBoardWrapper(){
  const stat = await GetAllFactoriesStat();

  return <StatsBoard loading={false} data={stat} />
}

interface StatsBoardProps {
  data?: Awaited<ReturnType<typeof GetAllFactoriesStat>>;
  loading: boolean;
}

function StatsBoard(props: StatsBoardProps){
  const { data, loading } = props;
  return (
    <div className="flex flex-wrap justify-center pt-8 gap-4 mb-8 lg:flex-row">
      <StatsCard
        title="Total Visits"
        value={data?.visits.toLocaleString() || ""}
        icon={<EyeIcon className="h-4 w-4"/>}
        helperText="All time receipts factory visits"
        loading={loading}
        color="text-blue-400"
      />
      
      <StatsCard
        title="Total Prints"
        value={data?.prints.toLocaleString() || ""}
        icon={<PrinterIcon className="h-4 w-4"/>}
        helperText="All time receipt factory prints"
        loading={loading}
        color="text-green-400"
      />

      <StatsCard
        title="Print Rate"
        value={data?.printRate.toLocaleString() || ""}
        icon={<PrinterIcon className="h-4 w-4"/>}
        helperText="Visits that result in receipt prints"
        loading={loading}
        color="text-fuchsia-400"
      />

      <StatsCard
        title="Bounce Rate"
        value={data?.bounceRate.toLocaleString() || ""}
        icon={<EyeIcon className="h-4 w-4"/>}
        helperText="Visits without interaction"
        loading={loading}
        color="text-red-400"
      />
    </div>
  );
}

export function StatsCard(
  { title, value, icon, helperText, loading, color } :
  { title: string, value: string, icon: ReactNode,
    helperText: string, loading: boolean, color: string }
){
  return(
    <Card className="flex float-left">
      <CardHeader className="p-2">
        <CardContent className="p-2">
          <div className="flex justify-between">
            <div className="text-4xl">
              {loading && (
                <Skeleton>
                  <span className="">0</span>
                </Skeleton>
              )}
              {!loading && value}
            </div>
            <HoverCard openDelay={0}>
              <HoverCardTrigger>
                <span className=""><EllipsisVerticalIcon className="h-4 w-4"/></span>
              </HoverCardTrigger>
              <HoverCardContent className="shadow-none bg-white p-1" sideOffset={-100}>
                {helperText}
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className={cn(color, "flex items-center space-x-2")}>
            <div className="inline-block">{title}</div>
            <div className="inline-block">{icon}</div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

function FactoryListSkeleton(){
  return <Skeleton/>
}

async function FactoryList(){
  const factoryList = await GetAllFactories();
  return(
    <div>
      <div className="flex justify-center flex-wrap pt-8 gap-4 mb-8 lg:max-w-3xl lg:justify-normal">
        {factoryList.map((factory) => (
          <FactoryCard key={factory.id} factory={factory}/>
        ))}
      </div>
    </div>
  );
}

function FactoryCard({factory}: {factory: ReceiptFactory}){
  return(
    <Card className="float-left max-w-xs min-w-[20rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="text-lg truncate font-bold">{factory.name}</span>
          {factory.published && <Badge>Published</Badge>}
          {!factory.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-xs">
          created {formatDistance(factory.createdAt, new Date(), {
            addSuffix: true,
          })}
          {factory.published && (
            <span className="flex items-center gap-2">
              <span>{factory.visits.toLocaleString()}</span>
              <EyeIcon className="h-4 w-4"/>
              <span>{factory.prints.toLocaleString()}</span>              
              <PrinterIcon className="h-4 w-4"/>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {factory.description || "No description"}
      </CardContent>
      <CardFooter>
        {factory.published && (
          <Button asChild className="w-full mt-2 text-sm gap-4">
            <Link href={`/factory/${factory.id}`}>
            <div className="flex flex-row items-center gap-1"><EyeIcon className="h-4 w-4"/> view prints</div>
            </Link>
          </Button>
        )}
        {!factory.published && (
          <Button asChild variant={"secondary"} className="w-full mt-2 text-sm gap-4">
            <Link href={`/editfactory/${factory.id}`}>
              <div className="flex flex-row items-center gap-1"><PencilSquareIcon className="h-4 w-4"/> edit factory</div>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}