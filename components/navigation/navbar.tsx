import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileButton } from "./profile-button";
import { auth } from "@/auth/config";
import CartIcon from "../cart/cart-icon";
import { SquareMousePointer } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  console.log(session, "from navbar");

  return (
    <header className="px-2 md:px-8">
      <nav className="flex items-center justify-between md:px-4 py-2">
        <Link href={"/"} className="flex items-center gap-x-2">
          <SquareMousePointer size={18} />
          <h4 className="text-base font-medium">Click Shop</h4>
        </Link>

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
