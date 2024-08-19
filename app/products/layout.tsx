import Navbar from "@/components/navigation/navbar";

export default function PoductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
