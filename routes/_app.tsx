import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { useScript } from "@deco/deco/hooks";
import { Context } from "@deco/deco";

const serviceWorkerScript = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@view-transition { navigation: auto; }`,
          }}
        />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />

        {/* Script da Trustvox para estrelas nas listagens - Conforme documentação oficial */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              // Script da Trustvox conforme documentação oficial
              var _trustvox_shelf_rate = _trustvox_shelf_rate || [];
              _trustvox_shelf_rate.push(['_storeId', '125156']);
              
              // Força o carregamento das estrelas após o DOM estar pronto
              document.addEventListener('DOMContentLoaded', function() {
                if (window.Trustvox && window.Trustvox.shelf) {
                  window.Trustvox.shelf.init();
                }
              });
            `,
          }}
        />
        <script
          type="text/javascript"
          async
          src="//rate.trustvox.com.br/widget.js"
        >
        </script>
      </Head>

      {/* Rest of Preact tree */}
      <ctx.Component />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(serviceWorkerScript) }}
      />
    </>
  );
});
