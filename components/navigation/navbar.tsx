import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileButton } from "./profile-button";
import { auth } from "@/auth/config";

export default async function Navbar() {
  const session = await auth();

  console.log(session, "from navbar");

  return (
    <header className="px-8">
      <nav className="flex items-center justify-between px-4 py-4">
        <h4>Logo</h4>

        <div>
          {!session ? (
            <Button className="h-8">
              <Link href="auth/login">Login</Link>
            </Button>
          ) : (
            <ProfileButton expires={session?.expires} user={session.user} />
          )}
        </div>
      </nav>
    </header>
  );
}
