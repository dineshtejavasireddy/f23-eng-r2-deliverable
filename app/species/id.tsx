// pages/species/[id].jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SpeciesDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the `id` from the URL

  const [species, setSpecies] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch the species data based on `id`.
    // For this example, we'll use dummy data.

    const { data: speciesData, error } = await supabase.from("species").select().eq("id", "id", species.id);

    // Simulate an API request delay
    setTimeout(() => {
      setSpecies(speciesData);
    }, 1000);
  }, [id]);

  if (!species) {
    // You can render a loading indicator here until data is fetched
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render the detailed view for the species */}
      <h1>{species.common_name}</h1>
      <h2>{species.scientific_name}</h2>
      <p>{species.description}</p>
      <p>Total Population: {species.total_population}</p>
    </div>
  );
};

export default SpeciesDetailPage;
