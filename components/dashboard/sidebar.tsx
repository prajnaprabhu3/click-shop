type SidebarProps = {
  label: string;
  path: string;
  icon: JSX.Element;
};

export default function Sidebar({ label, path, icon }: SidebarProps) {
  return <h4>Sidebar</h4>;
}
