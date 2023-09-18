// filter-species.tsx

"use client";

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  kingdom: "Animalia",
};

export default function FilterSpecies({ onFilteredSpeciesChange }) {
  //, setFilterCriteria, setFilteredSpecies }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    try {
      // Perform the filtering based on the selected kingdom here
      const supabase = createClientComponentClient<Database>();
      const { data: filteredData, error } = await supabase.from("species").select().eq("kingdom", input.kingdom);

      if (error) {
        throw new Error(error.message);
      }

      // Set the filtered species data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      //setFilteredSpecies(filteredData || []);
      onFilteredSpeciesChange(filteredData || []);

      // Update filter criteria based on user input
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setFilterCriteria({ kingdom: input.kingdom });

      setOpen(false);

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        //description: error.message || "Failed to filter species",
        variant: "destructive",
      });
    }

    form.reset(input);

    setOpen(false);
  };

  // const onSubmit = async (input: FormData) => {
  //   // ...

  //   // Update filter criteria based on user input
  //   setFilterCriteria({ kingdom: input.kingdom });

  //   setOpen(false);

  //   // Refresh all server components in the current route, including the SpeciesCard components
  //   router.refresh();
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Filter Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Species</DialogTitle>
          <DialogDescription>
            Filter species results here. Click &quot;Filter Species&quot; below when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
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
                          <SelectValue placeholder="Select a kingdom." />
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

              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Filter Species
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
  );
}

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
// // import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";
// import { type Database } from "@/lib/schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";
// import { useState, type BaseSyntheticEvent } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// // We use zod (z) to define a schema for the "Add species" form.
// // zod handles validation of the input values with methods like .string(), .nullable(). It also processes the form inputs with .transform() before the inputs are sent to the database.

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

// const defaultValues: Partial<FormData> = {
//   kingdom: "Animalia",
// };

// export default function FilterSpecies({ filterCriteria, setFilterCriteria, setFilteredSpecies }) {
//   const router = useRouter();
//   const [open, setOpen] = useState<boolean>(false);

//   const form = useForm<FormData>({
//     resolver: zodResolver(speciesSchema),
//     defaultValues,
//     mode: "onChange",
//   });

//   // const onSubmit = async (input: FormData) => {
//   //   // The `input` prop contains data that has already been processed by zod. We can now use it in a supabase query
//   //   const supabase = createClientComponentClient<Database>();
//   //   const { error } = await supabase.from("species").select().eq("kingdom", input.kingdom);

//   //   // .gt("total_population", min_population)
//   //   // .lt("total_population", max_population);

//   //   setFilteredSpecies(filteredData || []);

//   //   if (error) {
//   //     return toast({
//   //       title: "Something went wrong.",
//   //       description: error.message,
//   //       variant: "destructive",
//   //     });
//   //   }
//   //   // Reset form values to the data values that have been processed by zod.
//   //   // This way the user sees any changes that have occurred during transformation
//   //   form.reset(input);

//   //   setOpen(false);

//   //   // Refresh all server components in the current route. This helps display the newly created species because species are fetched in a server component, species/page.tsx.
//   //   // Refreshing that server component will display the new species from Supabase
//   //   router.refresh();
//   // };

//   const filterFunc = async (input: FormData) => {
//     try {
//       // Perform the filtering based on the selected kingdom here
//       const supabase = createClientComponentClient<Database>();
//       const { data: filteredData, error } = await supabase.from("species").select().eq("kingdom", input.kingdom);

//       if (error) {
//         throw new Error(error.message);
//       }

//       // Set the filtered species data
//       setFilteredSpecies(filteredData || []);

//       // Update filter criteria based on user input
//       setFilterCriteria({ kingdom: input.kingdom });

//       setOpen(false);

//       router.refresh();
//     } catch (error) {
//       toast({
//         title: "Something went wrong.",
//         description: error.message || "Failed to filter species",
//         variant: "destructive",
//       });
//     }

//     form.reset(input);

//     setOpen(false);
//   };

//   const onSubmit = async (input: FormData) => {
//     // ...

//     // Update filter criteria based on user input
//     setFilterCriteria({ kingdom: input.kingdom });

//     setOpen(false);

//     // Refresh all server components in the current route, including the SpeciesCard components
//     router.refresh();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="secondary" onClick={() => setOpen(true)}>
//           Filter Species
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Add Species</DialogTitle>
//           <DialogDescription>
//             Filter species results here. Click &quot;Filter Species&quot; below when you&apos;re done.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
//             <div className="grid w-full items-center gap-4">
//               <FormField
//                 control={form.control}
//                 name="kingdom"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Kingdom</FormLabel>
//                     {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
//                     <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a kingdom." />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectGroup>
//                           {kingdoms.options.map((kingdom, index) => (
//                             <SelectItem key={index} value={kingdom}>
//                               {kingdom}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex">
//                 <Button type="submit" className="ml-1 mr-1 flex-auto" onClick={() => void filterFunc}>
//                   Filter Species
//                 </Button>

//                 <Button
//                   type="button"
//                   className="ml-1 mr-1 flex-auto"
//                   variant="secondary"
//                   onClick={() => setOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
