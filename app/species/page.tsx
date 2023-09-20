import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

export default async function SpeciesList() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: species } = await supabase.from("species").select("*");

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
      </div>
      <Separator className="my-4" />

      <div className="flex flex-wrap justify-center">
        {species?.map((species) => {
          if (species.kingdom) {
            return (
              // <SpeciesCard
              //   key={species.id}
              //   species={species}
              //   // filterCriteria={filterCriteria}
              //   // setFilteredSpecies={setFilteredSpecies}
              //   // filterFunc={filterFunc}
              // />
              <SpeciesCard
                key={species.id}
                author={species.author}
                common_name={species.common_name}
                description={species.description}
                id={species.id}
                image={species.image}
                kingdom={species.kingdom}
                scientific_name={species.scientific_name}
                total_population={species.total_population}
                // Other props...
              />
            );
          }
          return null; // If the species doesn't match the filter, return null to skip rendering it
        })}
      </div>
    </>
  );
}
