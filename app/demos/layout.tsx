import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Demo Showcase',
  description: 'Explore AI capabilities through interactive demos',
};

interface DemosLayoutProps {
  children: React.ReactNode;
}

export default function DemosLayout({ children }: DemosLayoutProps) {
  return (
    <div className="w-full flex flex-col gap-2 pb-10">
      <div className="border-b pb-5 mb-5">
        <h1 className="text-2xl font-bold">AI Demo Showcase</h1>
        <p className="text-muted-foreground">
          Explore advanced AI capabilities through these interactive demos
        </p>
      </div>
      {children}
    </div>
  );
} 