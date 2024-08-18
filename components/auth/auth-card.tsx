import SocialOptions from "./social-options";
import NavigationOption from "./navigation-option";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  cardTitle: string;
  children: React.ReactNode;
  navigationOptionPath: string;
  navigationOptionLabel: string;
  showSocials?: boolean;
};

export const AuthCard = ({
  children,
  cardTitle,
  navigationOptionPath,
  navigationOptionLabel,
  showSocials,
}: AuthCardProps) => {
  return (
    <Card className="px-4 py-2 w-[500px] border-none shadow-none">
      <CardTitle className="px-5 py-6">{cardTitle}</CardTitle>
      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter>
          <SocialOptions />
        </CardFooter>
      )}

      <CardFooter>
        <NavigationOption
          path={navigationOptionPath}
          label={navigationOptionLabel}
        />
      </CardFooter>
    </Card>
  );
};
