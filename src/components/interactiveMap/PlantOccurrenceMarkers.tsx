import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { OccurrenceMarkerIcon } from "./MarkerIcons";

const plantOccurrencesFlat = (plant: PlantResult, plantIndex: number) =>
  plant.occurrences.flatMap((occurrence, occurrenceIndex) =>
    occurrence.media.map((media, mediaIndex) => ({
      ...occurrence,
      plantIndex,
      occurrenceIndex,
      mediaIndex,
      media,
    }))
  );

const PlantOccurrenceMarkers = ({
  showAllPlants,
}: {
  showAllPlants?: boolean;
}) => {
  const { plantSearchResults, activeIndexes, setActiveIndexes } =
    usePlantSearchContext();

  const { isViewingAllPlants, occurrences } = useMemo(() => {
    if (
      showAllPlants ||
      activeIndexes.plantIndex === null ||
      !plantSearchResults[activeIndexes.plantIndex]
    ) {
      return {
        isViewingAllPlants: true,
        occurrences: plantSearchResults.flatMap(plantOccurrencesFlat),
      };
    } else {
      return {
        isViewingAllPlants: false,
        occurrences: plantOccurrencesFlat(
          plantSearchResults[activeIndexes.plantIndex],
          activeIndexes.plantIndex
        ),
      };
    }
  }, [showAllPlants, plantSearchResults, activeIndexes.plantIndex]);

  const isActiveOccurrenceMedia = (plantIndex: number, mediaIndex: number) =>
    plantIndex === activeIndexes.plantIndex &&
    mediaIndex === activeIndexes.mediaIndex;

  return occurrences.map(
    (
      { occurrenceCoords, media, plantIndex, occurrenceIndex, mediaIndex },
      index
    ) => (
      <Marker
        key={index}
        position={[occurrenceCoords[1], occurrenceCoords[0]]}
        icon={OccurrenceMarkerIcon(
          media.url,
          isViewingAllPlants
            ? false
            : isActiveOccurrenceMedia(plantIndex, index)
        )}
        eventHandlers={{
          click: () =>
            setActiveIndexes({
              plantIndex,
              mediaIndex: occurrenceIndex + mediaIndex,
            }),
        }}
      />
    )
  );
};

export default PlantOccurrenceMarkers;
