import { GetFactoryStat } from "@/actions/getFactoryStat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return(
    <div>
      <Suspense fallback={<StatsBoard loading={true}/>}>
        <StatsBoardWrapper/>
      </Suspense>
    </div>
  );
}

async function StatsBoardWrapper(){
  const stat = await GetFactoryStat();

  return <StatsBoard loading={false} data={stat} />
}

interface StatsBoardProps {
  data?: Awaited<ReturnType<typeof GetFactoryStat>>;
  loading: boolean;
}

function StatsBoard(props: StatsBoardProps){
  const { data, loading } = props;

  return (
    <div>
      <StatsCard
        title="Total Visits"
        value={data?.visits.toLocaleString() || ""}
        icon={<EyeIcon className="h-7 w-7"/>}
        helperText="All time receipt factory visits"
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