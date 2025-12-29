import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
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
  const {
    plantList,
    activePlantIndex,
    activeMediaIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  const { isViewingAllPlants, plantOccurrences } = useMemo(() => {
    if (
      showAllPlants ||
      activePlantIndex === null ||
      !plantList[activePlantIndex]
    ) {
      return {
        isViewingAllPlants: true,
        plantOccurrences: plantList.map(occurrenceMediaFlat),
      };
    } else {
      return {
        isViewingAllPlants: false,
        plantOccurrences: [
          occurrenceMediaFlat(plantList[activePlantIndex], activePlantIndex),
        ],
      };
    }
  }, [showAllPlants, plantList, activePlantIndex]);

  const isActiveOccurrenceMedia = (
    isViewingAllPlants: boolean,
    plantIndex: number,
    mediaIndex: number
  ) =>
    isViewingAllPlants
      ? false
      : plantIndex === activePlantIndex && mediaIndex === activeMediaIndex;

  return plantOccurrences.map((occurrences, index) => (
    <MarkerClusterGroup
      key={isViewingAllPlants ? index : activeMediaIndex}
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
              isActiveOccurrenceMedia(
                isViewingAllPlants,
                plantIndex,
                mediaIndex
              )
            )}
            eventHandlers={{
              click: () => {
                setActivePlantIndex(plantIndex);
                setActiveMediaIndex(mediaIndex);
              },
            }}
          />
        )
      )}
    </MarkerClusterGroup>
  ));
};

export default PlantOccurrenceMarkers;
