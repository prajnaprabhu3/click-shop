import Link from "next/link";
import { Button } from "../ui/button";

type NavigationOptionProps = {
  path: string;
  label: string;
};

export default function NavigationOption({
  path,
  label,
}: NavigationOptionProps) {
  return (
    <Button variant={"link"} className="w-full" asChild>
      <Link href={path} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}
