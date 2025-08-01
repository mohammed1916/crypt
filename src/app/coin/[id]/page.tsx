import { notFound } from "next/navigation";
import { Suspense } from "react";
import CoinDetail from "../../../components/coin/CoinDetail";
import CoinChart from "../../../components/coin/CoinChart";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";

interface CoinDetailPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CoinDetailPage({ params }: CoinDetailPageProps) {
  const { id } = params;
  let coin: any = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/coin/${id}`);
    if (!res.ok) throw new Error();
    coin = await res.json();
  } catch {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <CoinDetail coin={coin} />
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <CoinChart coinId={id} />
        </section>
      </Suspense>
    </main>
  );
}
