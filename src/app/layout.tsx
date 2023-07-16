import React from "react";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "./ui/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='zh-Hans'>
      <Script
        id="piwik"
        dangerouslySetInnerHTML={{
          __html: `
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
                var u="https://piwik.seoipo.com/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '11']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
        `,
        }}
      />
      <body>
        <Navigation />
        {children}
        <Script
          src='https://oss.newzone.top/instantpage.min.js'
          type='module'
          strategy='lazyOnload'
        />
      </body>
    </html>
  );
}
