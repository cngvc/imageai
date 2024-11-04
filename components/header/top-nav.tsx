import Credits from "@/components/header/credits";
import Container from "@/components/ui/container";
import { AppInternalUrls } from "@/utils/constants/app-internal-urls.constants";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { BotMessageSquare, LayoutDashboard, ScanFace } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function TopNav() {
  const user = await currentUser();

  return (
    <div className="w-full shadow">
      <Container className="flex flex-col">
        <div className="flex items-center justify-center p-2 mx-auto w-full max-w-5xl py-4">
          <div className="flex items-center overflow-x-auto gap-4 justify-between w-full">
            <div className="flex flex-col items-center cursor-pointer">
              <Link href={AppInternalUrls.home}>
                <Image
                  src="/images/logo.png"
                  alt="imageAI logo"
                  className="flex-shrink-0"
                  height={30}
                  width={150}
                />
              </Link>
            </div>
            <div className="flex gap-4 justify-end">
              {user && (
                <Link href={`${AppInternalUrls.dashboard}`}>
                  <div className="flex flex-col items-center cursor-pointer">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                  </div>
                </Link>
              )}
              <Link href={AppInternalUrls.chat}>
                <div className="flex flex-col items-center cursor-pointer">
                  <BotMessageSquare className="h-8 w-8 text-primary" />
                </div>
              </Link>

              {user && (
                <div className="flex flex-col items-center cursor-pointer">
                  <Link href={AppInternalUrls.credits}>
                    <Credits />
                  </Link>
                </div>
              )}

              <div className="flex flex-col items-center cursor-pointer">
                <SignedOut>
                  <SignInButton>
                    <ScanFace className="h-8 w-8 text-primary cursor-pointer" />
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center h-8 w-8">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
