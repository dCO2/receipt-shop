import { GetAllFactoriesStat, GetAllFactories } from "@/actions/factory";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import CreateFactoryBtn from "@/components/CreateFactoryBtn";
import { ReceiptFactory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistance } from "date-fns";


export default function Home() {
  return(
    <div>
      <Suspense fallback={<StatsBoard loading={true}/>}>
        <StatsBoardWrapper/>
      </Suspense>
      <div>
        <h2>Your Factories</h2>
        <CreateFactoryBtn/>
      </div>
      <div>
        <FactoryList/>
        {/* <Suspense fallback={<FactoryList/>}>
          <FactoryList/>
        </Suspense> */}
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
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Visits"
        value={data?.visits.toLocaleString() || ""}
        icon={<EyeIcon className="h-7 w-7"/>}
        helperText="All time receipts factory visits"
        loading={loading}
        className=""
      />
      
      <StatsCard
        title="Total Prints"
        value={data?.prints.toLocaleString() || ""}
        icon={<EyeIcon className="h-7 w-7"/>}
        helperText="All time receipt factory prints"
        loading={loading}
        className=""
      />

      <StatsCard
        title="Print Rate"
        value={data?.printRate.toLocaleString() || ""}
        icon={<EyeIcon className="h-7 w-7"/>}
        helperText="Visits that result in receipt prints"
        loading={loading}
        className=""
      />

      <StatsCard
        title="Bounce Rate"
        value={data?.bounceRate.toLocaleString() || ""}
        icon={<EyeIcon className="h-7 w-7"/>}
        helperText="Visits without interaction"
        loading={loading}
        className=""
      />
    </div>
  );
}

function StatsCard(
  { title, value, icon, helperText, loading, className } :
  { title: string, value: string, icon: ReactNode,
    helperText: string, loading: boolean, className: string }
){
  return(
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle> {icon}
      </CardHeader>
      <CardContent>
        <div>
          {loading && (
            <Skeleton>
              <span className="">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="">{helperText}</p>
      </CardContent>
    </Card>
  )
}

function FactoryListSkeleton(){
  return <Skeleton/>
}

async function FactoryList(){
  const factoryList = await GetAllFactories();
  return(
    <>
      {factoryList.map((factory) => (
        <FactoryCard key={factory.id} factory={factory}/>
      ))}
    </>
  );
}

function FactoryCard({factory}: {factory: ReceiptFactory}){
  return(
    <Card>
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
              View submissions <span>icon</span>
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