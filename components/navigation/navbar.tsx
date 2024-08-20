import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileButton } from "./profile-button";
import { auth } from "@/auth/config";
import CartIcon from "../cart/cart-icon";
import Logo from "./logo";

export default async function Navbar() {
  const session = await auth();

  console.log(session, "from navbar");

  return (
    <header className="px-2 md:px-8  md:my-0">
      <nav className="flex items-center justify-between md:px-4 md:py-2">
        <Logo />

        <div className="flex items-center gap-x-10">
          <CartIcon />
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
