export const PublicRouteLayout = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <main className={`flex flex-col max-w-6xl mx-auto px-4 ${className}`}>
      {children}
    </main>
  );
};
