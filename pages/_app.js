import "../styles/globals.css";
import Layout from "../container/Layout";
import { MeshProvider } from "@meshsdk/react";

function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </MeshProvider>
  );
}

export default MyApp;
