import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "报价器",
    template: "%s | Quotation"
  },
  // alternates: {
  //   languages: {
  //     "en-US": "/en",
  //     "zh-CN": "/",
  //   },
  // },
  description: "纸张报价器",
  // verification: {
  //   google: "_OQGiIpYz87USAsgJV2C07-JJhQ8myV_4GoM1kDjFic",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="google-site-verification" content="_OQGiIpYz87USAsgJV2C07-JJhQ8myV_4GoM1kDjFic" />
        <meta name="baidu-site-verification" content="codeva-pEoMg5F0Cv" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8196371508613271" crossOrigin="anonymous"></script>
        <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <div className="pb-8"></div>
        <footer className="w-full py-3 border-t bg-white/90 dark:bg-gray-900/80 dark:border-gray-800/50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Cropyright @ Suyd 2025</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
