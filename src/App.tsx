import { usePath } from '@/app/router';
import { pages } from '@/app/pages';
import { matchRoute } from '@/app/routes';
import { Layout } from '@/components/layout/Layout';
import { ComingSoon } from '@/pages/ComingSoon';

export default function App() {
  const path = usePath();
  const match = matchRoute(path);
  const Page = match?.route.implemented ? pages[match.route.id] : undefined;

  return (
    <Layout>
      {Page && match ? <Page params={match.params} /> : <ComingSoon route={match?.route ?? null} path={path} />}
    </Layout>
  );
}
