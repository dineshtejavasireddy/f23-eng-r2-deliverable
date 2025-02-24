"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// We use zod (z) to define a schema for the "Add species" form.
// zod handles validation of the input values with methods like .string(), .nullable(). It also processes the form inputs with .transform() before the inputs are sent to the database.

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

const defaultValues: Partial<FormData> = {
  kingdom: kingdoms.options[0], //"Animalia",
};

export default function AddSpeciesDialog({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<WikipediaResponse[]>([]); // Initialize as an empty array
  const [searchWikipediaVisible, setSearchWikipediaVisible] = useState<boolean>(false); // Control visibility of Wikipedia search input

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    // The `input` prop contains data that has already been processed by zod. We can now use it in a supabase query
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase.from("species").insert([
      {
        author: userId,
        common_name: input.common_name,
        description: input.description,
        kingdom: input.kingdom,
        scientific_name: input.scientific_name,
        total_population: input.total_population,
        image: input.image,
      },
    ]);

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

    // Refresh all server components in the current route. This helps display the newly created species because species are fetched in a server component, species/page.tsx.
    // Refreshing that server component will display the new species from Supabase
    router.refresh();
  };

  //Interface Wikipedia API Response Data for Following Function
  interface WikipediaResponse {
    title: string;
    extract: string;
    originalimage: {
      source: string;
    };
  }

  //Retrieves Wikipedia API Search Data and Populates Add Species Dialog with Information (Feature 3-Stretch)
  const fillWithWikipediaData = async (searchQuery: string) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`);

      if (!response.ok) {
        throw new Error("Failed to fetch Wikipedia data");
      }
      const data = (await response.json()) as WikipediaResponse;

      // Extract relevant data from the Wikipedia response
      const sampleData = {
        scientific_name: "",
        common_name: data.title || "",
        description: data.extract || "",
        image: data.originalimage?.source || "",
        population: 0, // Provides a default message if data is not found
      };

      // Set form field values with the Wikipedia data
      form.setValue("scientific_name", sampleData.scientific_name);
      form.setValue("common_name", sampleData.common_name);
      form.setValue("image", sampleData.image);
      form.setValue("description", sampleData.description);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Wikipedia data",
        variant: "destructive",
      });
    }
  };

  const searchWikipedia = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${searchQuery}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Wikipedia search results");
      }
      const data = (await response.json()) as { query: { search?: WikipediaResponse[] } };

      // Extract search results from the Wikipedia response
      const results = data.query.search ?? [];

      // Update searchResults state with the retrieved search results
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Wikipedia search results",
        variant: "destructive",
      });
    }
  };

  const handleFillWithWikipedia = () => {
    setSearchWikipediaVisible(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Icons.add className="mr-3 h-5 w-5" />
          Add Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Species</DialogTitle>
          <DialogDescription>
            Add a new species here. Click &quot;Add Species&quot; below when you&apos;re done.
          </DialogDescription>
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
                      <Input placeholder="Cavia porcellus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
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
                    <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} defaultValue={field.value}>
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
                        placeholder="300000"
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
                      <Input
                        placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/George_the_amazing_guinea_pig.jpg/440px-George_the_amazing_guinea_pig.jpg"
                        {...field}
                      />
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
                        <Textarea
                          value={value ?? ""}
                          placeholder="The guinea pig or domestic guinea pig, also known as the cavy or domestic cavy, is a species of rodent belonging to the genus Cavia in the family Caviidae."
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Add Species
                </Button>
                <Button
                  type="button"
                  className="ml-1 mr-1 flex-auto"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                {/*Wikipedia API Search Button*/}
                <Button
                  type="button"
                  className="ml-1 mr-1 flex-auto"
                  //onClick={() => void fillWithWikipediaData(form.getValues("common_name"))}
                  onClick={() => handleFillWithWikipedia()}
                >
                  Fill with Wikipedia Data
                </Button>
              </div>

              {/*Display for Wikipedia Search Results (Only displays when user clicks "fill with..." button)*/}
              {searchWikipediaVisible && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    *Note that this feature only fetches Common Name, Image URL, and Description.*
                  </p>

                  {/* Input field for Wikipedia search (User types common_name and selects an article to pull from*/}
                  <Input
                    type="text"
                    placeholder="Search Wikipedia with Species Common Name and Select Article"
                    onChange={(e) => void searchWikipedia(e.target.value)}
                  />
                  {/* List of search results(allows users to look through options of API responses) */}
                  <ul>
                    {searchResults.map((result, index) => (
                      <li key={index}>
                        <Button variant="ghost" size="sm" onClick={() => void fillWithWikipediaData(result.title)}>
                          {result.title}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
