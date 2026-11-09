import { MobileTabBar, MobileTopBar, Sidebar } from "@/components/layout/app-nav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 outline-none sm:px-6 lg:px-10 lg:pt-10 lg:pb-16"
        >
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
