import { GetAllFactoriesStat, GetAllFactories } from "@/actions/factory";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { EyeIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import CreateFactoryBtn from "@/components/CreateFactoryBtn";
import { ReceiptFactory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


export default function Home() {
  return(
    <div>
      <Suspense fallback={<StatsBoard loading={true}/>}>
        <StatsBoardWrapper/>
      </Suspense>
      <hr/>
      <div>
        <h2>Your Factories</h2>
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
        className=""
      />
      
      <StatsCard
        title="Total Prints"
        value={data?.prints.toLocaleString() || ""}
        icon={<EyeIcon className="h-4 w-4"/>}
        helperText="All time receipt factory prints"
        loading={loading}
        className=""
      />

      <StatsCard
        title="Print Rate"
        value={data?.printRate.toLocaleString() || ""}
        icon={<EyeIcon className="h-4 w-4"/>}
        helperText="Visits that result in receipt prints"
        loading={loading}
        className=""
      />

      <StatsCard
        title="Bounce Rate"
        value={data?.bounceRate.toLocaleString() || ""}
        icon={<EyeIcon className="h-4 w-4"/>}
        helperText="Visits without interaction"
        loading={loading}
        className=""
      />
    </div>
  );
}

export function StatsCard(
  { title, value, icon, helperText, loading, className } :
  { title: string, value: string, icon: ReactNode,
    helperText: string, loading: boolean, className: string }
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
          <div className="flex items-center space-x-2">
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
    <div className="flex flex-wrap justify-center pt-8 gap-4 mb-8 lg:max-w-3xl">
      {factoryList.map((factory) => (
        <FactoryCard key={factory.id} factory={factory}/>
      ))}
    </div>
  );
}

function FactoryCard({factory}: {factory: ReceiptFactory}){
  return(
    <Card className="max-w-xs min-w-[20rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{factory.name}</span>
          {factory.published && <span>Published (Badge)</span>}
          {!factory.published && <span>Draft (Badge)</span>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(factory.createdAt, new Date(), {
            addSuffix: true,
          })}
          {factory.published && (
            <span className="flex items-center gap-2">
              <span>icon</span>
              <span>{factory.visits.toLocaleString()}</span>
              <span>icon</span>
              <span>{factory.prints.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {factory.description || "No description"}
      </CardContent>
      <CardFooter>
        {factory.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/factory/${factory.id}`}>
              View prints <span>icon</span>
            </Link>
          </Button>
        )}
        {!factory.published && (
          <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/editfactory/${factory.id}`}>
              Edit factory <span>icon</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}