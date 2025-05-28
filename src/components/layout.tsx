import { Header } from "./header";

export const Layout = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Header />
      <hr />
      <main className={`flex flex-col max-w-6xl mx-auto p-4 ${className}`}>
        {children}
      </main>
    </>
  );
};
