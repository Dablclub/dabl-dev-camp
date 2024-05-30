import PageWithNavbar from '@/components/layout/page';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <PageWithNavbar>
      <div className="page">
        <div className="container md:pt-4 lg:pt-12 xl:pt-20">
          <h1 className="mb-4 text-6xl">React to Web3 Bootcamp</h1>
        </div>
      </div>
    </PageWithNavbar>
  );
}
