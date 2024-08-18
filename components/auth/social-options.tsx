import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SocialOptions() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        className="flex gap-4 w-full"
        variant={"outline"}
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p> Sign in with google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        className="flex gap-4 w-full"
        variant={"outline"}
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p> Sign in with github</p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
}
