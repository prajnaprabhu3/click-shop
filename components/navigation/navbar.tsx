import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileButton } from "./profile-button";
import { auth } from "@/auth/config";
import CartIcon from "../cart/cart-icon";

export default async function Navbar() {
  const session = await auth();

  console.log(session, "from navbar");

  return (
    <header className="px-8">
      <nav className="flex items-center justify-between px-4 py-2">
        <h4>Logo</h4>

        <div>
          {!session ? (
            <Button className="h-8">
              <Link href="auth/login">Login</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-x-8">
              <CartIcon />
              <ProfileButton expires={session?.expires} user={session.user} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
