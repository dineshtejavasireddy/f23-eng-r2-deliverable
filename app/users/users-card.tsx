//Users Card Component File

"use client";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import { useEffect, useState } from "react";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfilesCardProps {
  profiles: Profiles;
}

export default function UsersCard({ profiles }: ProfilesCardProps) {
  const emailLink = `mailto:${profiles.email}`;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //Leads to External Email Dialog with Populated Email Address (Feature 3-Stretch)
  const handleEmailClick = () => {
    if (isMounted) {
      window.open(emailLink);
    }
  };

  return (
    //Display for User Cards with User Information (Feature 3-Stretch)
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      <h3 className="mt-3 text-2xl font-semibold">
        <center>{profiles.display_name}</center>
      </h3>
      <h4 className="text-lg font-light italic">
        <center>{profiles.email ? profiles.email.slice(0, 20).trim() + "..." : ""}</center>
      </h4>
      <p>{profiles.biography ? profiles.biography.slice(0, 160).trim() + "..." : ""}</p>
      <center>
        <Button className="mt-3 w-full" onClick={handleEmailClick}>
          Email User
        </Button>
      </center>
    </div>
  );
}
