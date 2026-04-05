import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReduxProvider from "@/store/provider";
import QueryProvider from "@/lib/QueryProvider";
import DarkModeProvider from "@/components/layout/DarkModeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Atlantic — Admin Panel",
  description: "Equestrian facility management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <QueryProvider>
            <AntdRegistry>
              <DarkModeProvider>
                {children}
              </DarkModeProvider>
            </AntdRegistry>
          </QueryProvider>
        </ReduxProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
