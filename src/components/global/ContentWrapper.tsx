export const ContentWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`mx-auto max-w-screen-xl p-4 ${className}`}>{children}</div>;
};

export default ContentWrapper;
