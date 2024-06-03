import { useRecoilValue } from 'recoil';
import { currentBuildingState } from '../../atom/search';
import BuildingServiceView from './BuildingInfoServiceView';
import BuildingImageSlider from './BuildingImageSlider';

export default function BuildingInfo() {
  const currentBuilding = useRecoilValue(currentBuildingState);

  const BuildingImageUrl = currentBuilding?.building.images;
  const BuildingId = currentBuilding?.building.id;
  return (
    <>
      <div
        className="hidden-md mb:h-[43.25rem] mb:w-full md:w-[30.6875rem] md:h-[56.75rem]  mb:bottom-0 z-[991]
        md:fixed md:top-[110px]  md:rounded-3xl md:shadow-2xl md:right-[530px] md:bottom-5 
        rounded-3xl flex flex-col mb:top-[70px] absolute ease-in duration-300 shadow-2xl mb:right-[0px] bottom-5 bg-white p-0 m-0 
       "
      >
        <div className="">
          <BuildingImageSlider
            images={BuildingImageUrl!}
            buildingId={BuildingId!}
          />
        </div>

        <div className="flex flex-col justify-start items-center bg-[#E4EEFF] overflow-hidden overflow-y-scroll scrollbar-hide rounded-b-3xl">
          <BuildingServiceView currentBuilding={currentBuilding} />
        </div>
      </div>
    </>
  );
}
