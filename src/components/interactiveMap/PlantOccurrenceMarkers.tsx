import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { OccurrenceMarkerIcon } from "./MarkerIcons";

const PlantOccurrenceMarkers = ({
  showAllPlants,
}: {
  showAllPlants?: boolean;
}) => {
  const {
    plantSearchResults,
    activePlantIndexes: { plantIndex },
    setActivePlantIndexes,
  } = usePlantSearchContext();

  const plantOccurrencesFlat = (plant: PlantResult, plantIndex: number) =>
    plant.occurrences.flatMap((occurrence, occurrenceIndex) =>
      occurrence.media.map((media, mediaIndex) => ({
        ...occurrence,
        plantIndex,
        media,
        mediaIndex: occurrenceIndex + mediaIndex,
      }))
    );

  const occurrences = useMemo(() => {
    if (
      showAllPlants ||
      plantIndex === null ||
      !plantSearchResults[plantIndex]
    ) {
      return plantSearchResults.flatMap(plantOccurrencesFlat);
    } else {
      return plantOccurrencesFlat(plantSearchResults[plantIndex], plantIndex);
    }
  }, [showAllPlants, plantSearchResults, plantIndex]);

  return occurrences.map(
    ({ occurrenceCoords, media, plantIndex, mediaIndex }, index) => (
      <Marker
        key={index}
        position={[occurrenceCoords[1], occurrenceCoords[0]]}
        icon={OccurrenceMarkerIcon(media.url)}
        eventHandlers={{
          click: () => setActivePlantIndexes({ plantIndex, mediaIndex }),
        }}
      />
    )
  );
};

export default PlantOccurrenceMarkers;
