"use client";

import { useEffect } from "react";
import Image from "next/image";
import Uparrow from "@/assets/uil_arrow-up.svg";
import { NavLinks } from "@/components/NavLinks";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import logo from "@/assets/Logo.svg";
import { useMyContext } from "@/context/MyContext";

export default function Navbar() {
  const { userProfile, setUserProfile } = useMyContext();
  const { user } = useUser();

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      const fetchUserData = async () => {
        try {
            const email = user.primaryEmailAddress?.emailAddress || "";
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/user/verify/?email=${encodeURIComponent(email)}`
          );

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data); 
          } else {
            const newUser = {
              name: user.fullName,
              picture: user.imageUrl,
              email: email,
            };

            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
              }
            );

            if (createResponse.status === 201) {
              const createdUser = await createResponse.json();
              console.log(createdUser);
              setUserProfile(createdUser);
            } else {
              console.error("Error creating user");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [user, setUserProfile]);

  return (
    <nav className="fixed top-0 backdrop-blur-md z-30 w-full">
      <div className="flex justify-between items-center h-[10vh] px-6 md:px-32 w-full">
        <div className="flex gap-2 items-center">
          <Image src={logo} alt="Logo" width={35} height={35} />
          <Link
            href="/"
            className="font-medium font-chillax text-[1.2rem] md:text-[1.5rem] text-white"
          >
            CAREERLINK
          </Link>
        </div>

        <div className="hidden md:flex font-medium">
          <NavLinks />
        </div>

        <SignedOut>
          <Link href="/sign-in" className="hidden md:flex">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-[#171717] flex items-center px-4 py-2 rounded-full active:bg-[#7D47EA]"
            >
              <span>Sign in</span>
              <Image src={Uparrow} alt="up-arrow" className="ml-2" />
            </HoverBorderGradient>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* Mobile Menu Button (visible on small screens) */}
        <div className="flex md:hidden">
          <button className="text-white">
            <Image src={Uparrow} alt="mobile-menu" width={30} height={30} />
          </button>
        </div>
      </div>
    </nav>
  );
}