/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// // species-card.tsx

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
// import type { Database } from "@/lib/schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState, type BaseSyntheticEvent } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { type FilterCriteria } from "./types"; // Import the FilterCriteria interface

// type Species = Database["public"]["Tables"]["species"]["Row"];

// const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// const speciesSchema = z.object({
//   common_name: z
//     .string()
//     .nullable()
//     // Transform empty string or only whitespace input to null before form submission
//     .transform((val) => (val?.trim() === "" ? null : val?.trim())),
//   description: z
//     .string()
//     .nullable()
//     .transform((val) => (val?.trim() === "" ? null : val?.trim())),
//   kingdom: kingdoms,
//   scientific_name: z
//     .string()
//     .trim()
//     .min(1)
//     .transform((val) => val?.trim()),
//   total_population: z.number().int().positive().min(1).optional(),
//   image: z
//     .string()
//     .url()
//     .nullable()
//     .transform((val) => val?.trim()),
// });

// type FormData = z.infer<typeof speciesSchema>;

// interface SpeciesCardProps {
//   species: Species;
//   filterCriteria: FilterCriteria; // Define the type for your filter criteria
//   filterFunc: (species: Species, filterCriteria: FilterCriteria) => boolean; // Define the filterFunc prop
//   setFilteredSpecies: (filteredData: Species[]) => void;
// }

// export default function SpeciesCard({ species }: SpeciesCardProps) {
//   const router = useRouter();
//   const [open, setOpen] = useState<boolean>(false);

//   const defaultValues: Partial<FormData> = {
//     common_name: species.common_name,
//     description: species.description,
//     kingdom: species.kingdom,
//     scientific_name: species.scientific_name,
//     total_population: species.total_population,
//     image: species.image,
//   };

//   const form = useForm<FormData>({
//     resolver: zodResolver(speciesSchema),
//     defaultValues,
//     mode: "onChange",
//   });

//   // const shouldDisplaySpecies = () => {
//   //   // Implement your filtering logic here based on filterCriteria
//   //   // For example, if you want to filter by kingdom:
//   //   if (filterCriteria.kingdom && species.kingdom !== filterCriteria.kingdom) {
//   //     return false; // Hide the species
//   //   }

//   //   // Add more filtering conditions as needed

//   //   return true; // Display the species
//   // };

//   // if (!shouldDisplaySpecies()) {
//   //   return null; // Don't render the component if it doesn't meet the filter criteria
//   // }

//   const onSubmit = async (input: FormData) => {
//     const supabase = createClientComponentClient<Database>();
//     const { error } = await supabase
//       .from("species")
//       .update([
//         {
//           common_name: input.common_name,
//           description: input.description,
//           kingdom: input.kingdom,
//           scientific_name: input.scientific_name,
//           total_population: input.total_population,
//           image: input.image,
//         },
//       ])
//       .eq("scientific_name", species.scientific_name);

//     if (error) {
//       return toast({
//         title: "Something went wrong.",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//     // Reset form values to the data values that have been processed by zod.
//     // This way the user sees any changes that have occurred during transformation
//     form.reset(input);

//     setOpen(false);

//     router.refresh();
//   };

//   const handleDelete = async () => {
//     const confirmation = window.confirm(`Are you sure you want to delete ${species.scientific_name}?`);

//     if (confirmation) {
//       const supabase = createClientComponentClient<Database>();

//       const { error } = await supabase.from("species").delete().eq("id", species.id);

//       if (error) {
//         return toast({
//           title: "Something went wrong.",
//           description: error.message,
//           variant: "destructive",
//         });
//       }
//     }
//     setOpen(false);

//     router.refresh();
//   };

//   return (
//     <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
//       {species.image && (
//         <div className="relative h-40 w-full">
//           <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
//         </div>
//       )}
//       <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
//       <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
//       <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
//       {/* Replace with detailed view*/}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
//             Learn More
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>{species.common_name}</DialogTitle>
//             <DialogDescription>{species.scientific_name}</DialogDescription>
//           </DialogHeader>

//           <Form {...form}>
//             <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
//               <div className="grid w-full items-center gap-4">
//                 <FormField
//                   control={form.control}
//                   name="kingdom"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Kingdom</FormLabel>
//                       {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
//                       <Select
//                         onValueChange={(value) => field.onChange(kingdoms.parse(value))}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a kingdom." />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectGroup>
//                             {kingdoms.options.map((kingdom, index) => (
//                               <SelectItem key={index} value={kingdom}>
//                                 {kingdom}
//                               </SelectItem>
//                             ))}
//                           </SelectGroup>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormItem>
//                   <FormLabel>Common Name</FormLabel>
//                   <Input type="text" {...form.register("common_name")} />
//                   <FormMessage />
//                 </FormItem>

//                 <FormItem>
//                   <FormLabel>Scientific Name</FormLabel>
//                   <Input type="text" {...form.register("scientific_name")} />
//                   <FormMessage />
//                 </FormItem>

//                 <FormItem>
//                   <FormLabel>Total Population</FormLabel>
//                   <Input type="number" {...form.register("total_population")} />
//                   <FormMessage />
//                 </FormItem>

//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <Textarea {...form.register("description")} />
//                   <FormMessage />
//                 </FormItem>

//                 <FormItem>
//                   <FormLabel>Image URL</FormLabel>
//                   <Input type="url" {...form.register("image")} />
//                   <FormMessage />
//                 </FormItem>

//                 <div className="flex">
//                   <Button type="submit" className="ml-1 mr-1 flex-auto">
//                     Save Changes
//                   </Button>

//                   <Button
//                     type="button"
//                     className="ml-1 mr-1 flex-auto"
//                     variant="secondary"
//                     onClick={() => handleDelete}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  total_population: z.number().int().positive().min(1).optional(),
  image: z
    .string()
    .url()
    .nullable()
    .transform((val) => val?.trim()),
});

type FormData = z.infer<typeof speciesSchema>;

interface SpeciesCardProps {
  species: Species;
  filterCriteria: FilterCriteria; // Define the type for your filter criteria
  setFilteredSpecies: (filteredData: Species[]) => void;
  filterFunc: (species: Species, filterCriteria: FilterCriteria) => boolean; // Define the filterFunc prop
}
//filterCriteria, setFilteredSpecies, filterFunc
export default function SpeciesCard({ species }: SpeciesCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showRelatedArticles, setShowRelatedArticles] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]); // Define relatedArticles state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultValues: Partial<FormData> = {
    common_name: species.common_name,
    description: species.description,
    kingdom: species.kingdom,
    scientific_name: species.scientific_name,
    total_population: species.total_population,
    image: species.image,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    // The `input` prop contains data that has already been processed by zod. We can now use it in a supabase query
    const supabase = createClientComponentClient<Database>();
    //alter this section code
    const { error } = await supabase
      .from("species")
      .update([
        {
          common_name: input.common_name,
          description: input.description,
          kingdom: input.kingdom,
          scientific_name: input.scientific_name,
          total_population: input.total_population,
          image: input.image,
        },
      ])
      .eq("scientific_name", species.scientific_name);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }
    // Reset form values to the data values that have been processed by zod.
    // This way the user sees any changes that have occurred during transformation
    form.reset(input);

    setOpen(false);

    router.refresh();
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(`Are you sure you want to delete ${species.scientific_name}?`);

    if (confirmation) {
      const supabase = createClientComponentClient<Database>();

      const { error } = await supabase.from("species").delete().eq("id", species.id);

      if (error) {
        return toast({
          title: "Something went wrong.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    setOpen(false);

    router.refresh();
  };

  const handleSocialClick = () => {
    if (isMounted) {
      const currentURL = window.location.href;
      const tweetText = `Check out this species from The T4SG Biodiversity Hub at ${currentURL}`;

      const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

      window.open(twitterURL, "_blank");
    }
  };

  // Function to fetch related articles
  const fetchRelatedArticles = async (speciesName) => {
    try {
      // Set your NewsAPI endpoint and API key here
      const apiKey = "8a504891b9ba47959f5e5bf69671f2cd";
      const newsApiEndpoint = "https://google-news-api1.p.rapidapi.com/search";
      const query = `${speciesName}`; // Adjust the query as needed

      // Make the API request to fetch articles
      const response = await axios.get(newsApiEndpoint, {
        params: {
          q: query,
          apiKey: apiKey,
        },
      });

      // Extract the articles from the response
      const articles = response.data.articles;

      return articles;
    } catch (error) {
      console.error("Error fetching related articles:", error);
      return [];
    }
  };

  const handleViewRelatedArticlesClick = async () => {
    try {
      // Fetch related articles based on the species name
      const articles = await fetchRelatedArticles(species.common_name);

      // Update the relatedArticles state with the fetched articles
      setRelatedArticles(articles);

      // Show the related articles section
      setShowRelatedArticles(true);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      setRelatedArticles([]);
    }
  };

  // const shouldDisplaySpecies = () => {
  //   // Implement your filtering logic here based on filterCriteria
  //   // For example, if you want to filter by kingdom:
  //   if (filterCriteria.kingdom && species.kingdom !== filterCriteria.kingdom) {
  //     return false; // Hide the species
  //   }

  //   // Add more filtering conditions as needed

  //   return true; // Display the species
  // };

  // if (!shouldDisplaySpecies()) {
  //   return null; // Don't render the component if it doesn't meet the filter criteria //setOpen(true), void //, void handleViewRelatedArticlesClick()
  // }

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      {/* Replace with detailed view*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full" onClick={() => setOpen(true)} href={`/species/${species.id}`}>
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>More About {species.scientific_name}</DialogTitle>
          </DialogHeader>

          {/*<div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
            {species.image && (
              <div className="relative h-40 w-full">
                <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
              </div>
            )}*/}
          <div>
            <div className="relative h-40 w-full">
              <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
            <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
            <h4 className="text-lg font-light italic">Total Population: {species.total_population}</h4>
            <h4 className="text-lg font-light italic">Kingdom: {species.kingdom}</h4>
            <p>{species.description}</p>

            {showRelatedArticles ? (
              <div>
                <h3 className="mt-3 text-2xl font-semibold">Related Articles</h3>
                {relatedArticles.length > 0 ? (
                  <ul>
                    {relatedArticles.slice(0, 3).map((article) => (
                      <li key={article.title as string}>
                        <Button
                          className="mt-3 w-full"
                          variant="secondary"
                          href={article.url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Button className="mt-3 w-full" variant="secondary">
                    No Relevant Articles Found
                  </Button>
                )}
              </div>
            ) : null}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
                  Edit Information
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Species Information for {species.scientific_name}</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
                    <div className="grid w-full items-center gap-4">
                      <FormField
                        control={form.control}
                        name="scientific_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scientific Name</FormLabel>
                            <FormControl>
                              <Input placeholder={species.scientific_name} id="scientific_input" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="common_name"
                        render={({ field }) => {
                          //  value, We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                          const { value, ...rest } = field;
                          return (
                            <FormItem>
                              <FormLabel>Common Name</FormLabel>
                              <FormControl>
                                <Input value={value ?? ""} placeholder={species.common_name} {...rest} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="kingdom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kingdom</FormLabel>
                            {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
                            <Select
                              onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                              defaultValue={species.kingdom}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a kingdom" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {kingdoms.options.map((kingdom, index) => (
                                    <SelectItem key={index} value={kingdom}>
                                      {kingdom}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="total_population"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total population</FormLabel>
                            <FormControl>
                              {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                              <Input
                                type="number"
                                placeholder={species.total_population}
                                {...field}
                                onChange={(event) => field.onChange(+event.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder={species.image} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => {
                          // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                          const { value, ...rest } = field;
                          return (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea value={value ?? ""} placeholder={species.description} {...rest} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <div className="flex">
                        <Button type="submit" className="ml-1 mr-1 flex-auto">
                          Confirm Edits
                        </Button>
                        <Button
                          type="button"
                          className="ml-1 mr-1 flex-auto"
                          variant="secondary"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Dialog>
        <DialogTrigger>
          <Button
            className="mt-3 w-full"
            variant="default"
            onClick={() => void handleViewRelatedArticlesClick()} // Trigger the fetch on click
            size="sm"
          >
            View Related Articles
          </Button>
        </DialogTrigger>
        <DialogContent>
          {showRelatedArticles ? (
            <div>
              <h3 className="mt-3 text-2xl font-semibold">Related Articles</h3>
              {relatedArticles.length > 0 ? (
                <ul>
                  {relatedArticles.slice(0, 3).map((article) => (
                    <li key={article.title as string}>
                      <Button
                        className="mt-3 w-full"
                        variant="secondary"
                        href={article.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Button className="mt-3 w-full" variant="secondary">
                  No Relevant Articles Found
                </Button>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog> */}

      <Button className="mt-3 w-full" variant="destructive" onClick={() => void handleDelete()}>
        Delete Species
      </Button>
      <Button
        className="mt-3 w-full"
        variant="secondary"
        onClick={handleSocialClick}
        target="_blank"
        size="sm"
        rel="noopener noreferrer"
      >
        <p>Share on Twitter</p>
      </Button>
    </div>
  );
}
