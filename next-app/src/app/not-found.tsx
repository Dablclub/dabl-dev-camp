import PageWithNavbar from '@/components/layout/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageWithNavbar>
      <div className="page">
        <div className="container pt-16 md:pt-32">
          <h2 className={`text-5xl tracking-tight md:text-6xl`}>
            404 | Not Found
          </h2>
          <p className="mt-4 text-2xl">Seems like you&apos;re lost!</p>
          <Link href="/">
            <Button className={`mt-6 h-12 text-lg md:mt-8 lg:mt-8 xl:mt-12`}>
              Take me Home
            </Button>
          </Link>
        </div>
      </div>
    </PageWithNavbar>
  );
}
