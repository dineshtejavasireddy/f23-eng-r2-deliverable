/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// "use client";
// import { Separator } from "@/components/ui/separator";
// import { TypographyH2 } from "@/components/ui/typography";
// import { createServerSupabaseClient } from "@/lib/server-utils";
// import { redirect } from "next/navigation";
// import { useState } from "react";
// import AddSpeciesDialog from "./add-species-dialog";
// import FilterSpecies from "./filter-species";
// import SpeciesCard from "./species-card";

// export default function SpeciesList() {
//   const [filterValue, setFilterValue] = useState("");
//   const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({ kingdom: "" });
//   const [filteredSpecies, setFilteredSpecies] = useState([]);
//   const [species, setSpecies] = useState([]); // Store all species data

//   const supabase = createServerSupabaseClient();

//   // Use useEffect to fetch species data when the component mounts
//   useEffect(() => {
//     const fetchSpeciesData = async () => {
//       const { data: session } = await supabase.auth.getSession();

//       if (!session) {
//         redirect("/");
//       }

//       try {
//         const { data } = await supabase.from("species").select("*");
//         setSpecies(data || []);
//       } catch (error) {
//         console.error("Error fetching species data:", error.message);
//       }
//     };

//     fetchSpeciesData(); // Call the fetch function within useEffect
//   }, []); // Empty dependency array means this effect runs once on component mount

//   return (
//     <>
//       <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
//         <TypographyH2>Species List</TypographyH2>
//         <FilterSpecies
//           filterValue={filterValue}
//           setFilterValue={setFilterValue}
//           setFilteredSpecies={setFilteredSpecies}
//         />
//         <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
//       </div>
//       <Separator className="my-4" />
//       <div className="flex flex-wrap justify-center">
//         {species?.map((singleSpecies) => (
//           <SpeciesCard
//             key={singleSpecies.id}
//             species={singleSpecies}
//             filterCriteria={filterCriteria}
//             setFilteredSpecies={setFilteredSpecies}
//             filterFunc={filterFunc}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

// "use client";

import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

//import { useState } from "react";

// import { useState } from "react"; // Import useState and useEffect
import { z } from "zod";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

// import { useState, type BaseSyntheticEvent } from "react";

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

export default async function SpeciesList() {
  //const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  //const [filterValue, setFilterValue] = useState(""); // State for the filter value
  //const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({ kingdom: "" });
  //const [filteredSpecies, setFilteredSpecies] = useState([]); // State for filtered species

  //usestate('')
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // const handleFilteredSpeciesChange = (filteredSpecies) => {
  //   // You can update the state or perform other actions here
  //   // For example, if you want to log the filtered species data:
  //   console.log("Filtered Species Data:", filteredSpecies);
  // };

  const { data: species } = await supabase.from("species").select("*");

  //const selectedKingdom = "Animalia"; // Initialize a variable to store the selected kingdom

  // const handleKingdomChange = (value) => {
  //   selectedKingdom = value as string; // Update the selected kingdom when the value changes
  // };

  // const handleDelete: Promise<void> = async () => {
  //   const confirmation = window.confirm(`Are you sure you want to delete ${species.scientific_name}?`);

  //   if (confirmation) {
  //     const supabase = createClientComponentClient<Database>();

  //     const { error } = await supabase.from("species").delete().eq("scientific_name", species.scientific_name);

  //     if (error) {
  //       return toast({
  //         title: "Something went wrong.",
  //         description: error.message,
  //         variant: "destructive",
  //       });
  //     }
  //   }
  // };

  // const [isSpecies, setIsSpecies] = useState<any>("");

  // const [selectedKingdom, setSelectedKingdom] = useState("Animalia"); // Initialize the selected kingdom state

  //let selectedKingdom = "Plantae"; // Set the default kingdom here
  //const kingvalue = (document.getElementById("selectking") as HTMLSelectElement).value;

  // const handleKingdomChange = (value) => {
  //   kingvalue = value as string; // Update the selected kingdom when the user changes it
  // };

  // const [selectedKingdom, setSelectedKingdom] = useState(''); // State to hold the selected kingdom

  // const handleSelectChange = (event) => {
  //   setSelectedKingdom(event.target.value); // Update the selected kingdom when the dropdown value changes
  // };

  // // Filter the species based on the selected kingdom
  // const filteredSpecies = speciesList.filter((species) => {
  //   if (selectedKingdom === '') {
  //     // If no kingdom is selected, show all species
  //     return true;
  //   } else {
  //     // Otherwise, filter by the selected kingdom
  //     return species.kingdom === selectedKingdom;
  //   }
  // });

  return (
    <>
      <div type="flex" className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        {/* <FilterSpecies
        //filterCriteria={filterCriteria}
        // filterValue={filterValue}
        // setFilterValue={setFilterValue}
        // setFilteredSpecies={setFilteredSpecies}
        //onFilteredSpeciesChange={handleFilteredSpeciesChange} <SelectValue placeholder="Select a kingdom" />
        //(value) => kingdoms.parse(value)} defaultValue={"Animalia"}> onValueChange={(value) => kingdoms.parse(value)} onChange={handleKingdomChange}>
        />
        <Select id="selectKingdom">
          <SelectTrigger>
            <SelectValue placeholder="Select a kingdom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {kingdoms.options.map((kingdom, index) => (
                <SelectItem key={index} value={kingdom}>
                  {kingdom}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

        {/* <select id="selectking" default={"Animalia"}>
          {" "}
          {/*onChange={handleKingdomChange}> */}
        {/* <option value="Animalia">Animalia</option>
          <option value="Plantae">Plantae</option>
          <option value="Fungi">Fungi</option>
          <option value="Protista">Protista</option>
          <option value="Archaea">Archaea</option>
          <option value="Bacteria">Bacteria</option>
        </select> */}
        {/* <SelectComponent onKingdomChange={handleKingdomChange} /> */}

        <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {/* {species?.map((species) => (
          <SpeciesCard
            key={species.id}
            species={species}
            //filterCriteria={filterCriteria}
            // setFilteredSpecies={setFilteredSpecies}
            // filterFunc={filterFunc}
          />
        ))} */}
        {/* <select id="selectking" default={selectedKingdom}>
          {" "}
          {/*onChange={handleKingdomChange}> */}
        {/* <option value="Animalia">Animalia</option>
          <option value="Plantae">Plantae</option>
          <option value="Fungi">Fungi</option>
          <option value="Protista">Protista</option>
          <option value="Archaea">Archaea</option>
          <option value="Bacteria">Bacteria</option>
        </select> */}

        {/* {filteredSpecies.length === 0 ? (
          <p>No species found.</p>
        ) : (
          filteredSpecies.map((species) => (
            <SpeciesCard key={species.id} species={species} />
          ))
        )} */}

        {species?.map((species) => {
          if (species.kingdom === "Animalia") {
            return (
              <SpeciesCard
                key={species.id}
                species={species}
                // filterCriteria={filterCriteria}
                // setFilteredSpecies={setFilteredSpecies}
                // filterFunc={filterFunc}
              />
            );
          }
          return null; // If the species doesn't match the filter, return null to skip rendering it
        })}
      </div>
    </>
  );
}

// function SelectComponent({ onKingdomChange }) {
//   return (
//     <Select defaultValue={"Animalia"}>
//       <SelectTrigger>
//         <SelectValue placeholder="Select a kingdom" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           {kingdoms.options.map((kingdom, index) => (
//             <SelectItem key={index} value={kingdom}>
//               {kingdom}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// }
// key={species.id}
// species = { species };
// filterCriteria = { filterCriteria };
// setFilteredSpecies = { setFilteredSpecies };

// {species?.map((species) => <SpeciesCard key={species.id} {...species} />)}
