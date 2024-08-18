import SocialOptions from "./social-options";
import NavigationOption from "./navigation-option";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  cardTitle: string;
  children: React.ReactNode;
  navigationOptionPath: string;
  navigationOptionLabel: string;
  showSocials?: boolean;
  customClass?: string;
};

export const AuthCard = ({
  children,
  cardTitle,
  navigationOptionPath,
  navigationOptionLabel,
  showSocials,
  customClass,
}: AuthCardProps) => {
  return (
    <Card className={cn("px-4 py-2 w-[500px] shadow-none", customClass)}>
      <CardTitle className="px-5 py-6">{cardTitle}</CardTitle>
      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter>
          <SocialOptions />
        </CardFooter>
      )}

      <CardFooter className="text-start items-start">
        <NavigationOption
          path={navigationOptionPath}
          label={navigationOptionLabel}
        />
      </CardFooter>
    </Card>
  );
};
