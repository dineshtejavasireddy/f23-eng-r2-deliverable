import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

import UsersCard from "./users-card";

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    return toast({
      title: "Something went wrong.",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Users List</TypographyH2>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {profiles?.map((profiles) => (
          <UsersCard
            key={profiles.id}
            profiles={profiles}
            // filterCriteria={filterCriteria}
            // setFilteredSpecies={setFilteredSpecies}
            // filterFunc={filterFunc}
          />
        ))}
        <h3 className="mt-3 text-2xl font-semibold">{profiles.display_name}</h3>
      </div>
    </>
  );
}
