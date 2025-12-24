import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
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

  const { isViewingAllPlants, plantOccurrences } = useMemo(() => {
    if (
      showAllPlants ||
      activeIndexes.plantIndex === null ||
      !plantSearchResults[activeIndexes.plantIndex]
    ) {
      return {
        isViewingAllPlants: true,
        plantOccurrences: plantSearchResults.map(occurrenceMediaFlat),
      };
    } else {
      return {
        isViewingAllPlants: false,
        plantOccurrences: [
          occurrenceMediaFlat(
            plantSearchResults[activeIndexes.plantIndex],
            activeIndexes.plantIndex
          ),
        ],
      };
    }
  }, [showAllPlants, plantSearchResults, activeIndexes.plantIndex]);

  const isActiveOccurrenceMedia = (
    isViewingAllPlants: boolean,
    plantIndex: number,
    mediaIndex: number
  ) =>
    isViewingAllPlants
      ? false
      : plantIndex === activeIndexes.plantIndex &&
        mediaIndex === activeIndexes.mediaIndex;

  return plantOccurrences.map((occurrences, index) => (
    <MarkerClusterGroup
      key={index}
      zoomToBoundsOnClick={false}
      spiderfyOnEveryZoom
      iconCreateFunction={isViewingAllPlants ? undefined : MarkerClusterIcon}
      maxClusterRadius={isViewingAllPlants ? 200 : 80}
    >
      {occurrences.map(
        ({ occurrenceCoords, media, plantIndex, mediaIndex }, index) => (
          <Marker
            key={index}
            position={[occurrenceCoords[1], occurrenceCoords[0]]}
            icon={OccurrenceMarkerIcon(
              media.url,
              isActiveOccurrenceMedia(isViewingAllPlants, plantIndex, index)
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
  ));
};

export default PlantOccurrenceMarkers;
