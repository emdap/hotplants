import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { PlantOccurrence } from "generated/graphql/graphql";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MarkerClusterIcon, OccurrenceMarkerIcon } from "./MarkerIcons";

type FlatOccurrenceMedia = Omit<PlantOccurrence, "media"> & {
  plantIndex: number;
  mediaIndex: number;
  media: PlantOccurrence["media"][number];
};

const occurrenceMediaFlat = (plant: PlantResult, plantIndex: number) => {
  let overallIndex = 0;
  return plant.occurrences.reduce<FlatOccurrenceMedia[]>((prev, occurrence) => {
    const mappedMedia = occurrence.media.map((media, index) => ({
      ...occurrence,
      plantIndex,
      mediaIndex: overallIndex + index,
      media,
    }));

    overallIndex += mappedMedia.length;
    return prev.concat(mappedMedia);
  }, []);
};

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
        occurrences: plantSearchResults.flatMap(occurrenceMediaFlat),
      };
    } else {
      return {
        isViewingAllPlants: false,
        occurrences: occurrenceMediaFlat(
          plantSearchResults[activeIndexes.plantIndex],
          activeIndexes.plantIndex
        ),
      };
    }
  }, [showAllPlants, plantSearchResults, activeIndexes.plantIndex]);

  const isActiveOccurrenceMedia = (plantIndex: number, mediaIndex: number) =>
    plantIndex === activeIndexes.plantIndex &&
    mediaIndex === activeIndexes.mediaIndex;

  return (
    <MarkerClusterGroup
      key={activeIndexes.mediaIndex}
      maxClusterRadius={10}
      zoomToBoundsOnClick={false}
      spiderfyOnEveryZoom
      iconCreateFunction={MarkerClusterIcon}
    >
      {occurrences.map(
        ({ occurrenceCoords, media, plantIndex, mediaIndex }, index) => (
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
                  mediaIndex,
                }),
            }}
          />
        )
      )}
    </MarkerClusterGroup>
  );
};

export default PlantOccurrenceMarkers;
