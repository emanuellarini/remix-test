import * as React from 'react';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react';
import { useContext } from 'react';
import StylesContext from './context/StylesContext';
import theme from './utils/theme';

import { Layout } from './components/Layout';

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  const styleData = useContext(StylesContext);

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="theme-color" content={theme.palette.primary.main} />
      {title ? <title>{title}</title> : null}
      <Meta />
      <Links />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      {styleData?.map(({ key, ids, css }) => (
        <style
          key={key}
          data-emotion={`${key} ${ids.join(' ')}`}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: css }}
        />
      ))}
    </head>
    <body>
    {children}
    <ScrollRestoration />
    <Scripts />
    {process.env.NODE_ENV === 'development' && <LiveReload />}
    </body>
    </html>
  );
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an unexpected error</h1>
          <p>{error.message}</p>
          <hr />
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
