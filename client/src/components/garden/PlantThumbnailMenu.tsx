import Button from "designSystem/Button";
import StyledMenu from "designSystem/StyledMenu";
import { MdImage } from "react-icons/md";

const SetThumbnailMenu = () =>
  //   {
  //   gardenId,
  //   refetchPlants,
  // }: {
  //   gardenId: string;
  //   refetchPlants: () => Promise<unknown>;
  // }
  {
    // const { activePlant, activeMediaUrl } = usePlantSelectionContext();

    // const [updatePlantMutation, { loading }] = useApolloMutation(
    //   UPDATE_GARDEN_PLANT,
    //   { variables: { gardenId } },
    // );

    return (
      <StyledMenu
        menuButton={
          <Button
            variant="secondary"
            size="small"
            icon={<MdImage size={24} />}
          />
        }
      />
    );
  };

export default SetThumbnailMenu;
