import { mobileReservationLayoutState } from '@/app/(search)/atom/media';
import {
  rsInfoState,
  selectedMembershipId,
  selectedOfficeId,
  userUpdateRlistPutState,
} from '@/app/(search)/atom/membership';
import {
  confirmedState,
  searchRemainingState,
  seatListReservation,
  selectedSeatAllState,
} from '@/app/(search)/atom/office';
import API from '@/utils/axios';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function SeatReservationList({
  seatTypes,
}: {
  seatTypes: string[];
}) {
  const [rsInfo, setRsInfo] = useRecoilState(rsInfoState);
  const [searchRemaining, setSearchRemaining] =
    useRecoilState(searchRemainingState);
  const MemberId = useRecoilValue(selectedMembershipId);
  const isMobile = useRecoilValue(mobileReservationLayoutState);
  const [selectedSeatAll, setSelectedSeatAll] =
    useRecoilState(selectedSeatAllState);

  const officeId = useRecoilValue(selectedOfficeId);
  const [seatList, setSeatList] = useRecoilState(seatListReservation);
  const [confirm, setConfirm] = useRecoilState(confirmedState);
  const seatImages: Record<string, string> = {
    오픈데스크: '/svg/reservation/opendesk.svg',
    포커스데스크: '/svg/reservation/focusdesk.svg',
    '1인실': '/svg/reservation/oneroom.svg',
    모니터데스크: '/svg/reservation/monitordesk.svg',
  };
  const [seatReservationList, setSeatReservationList] = useRecoilState(
    userUpdateRlistPutState,
  );

  const handleSeatStyleClick = async (seatStyle: string) => {
    console.log('왜 널일까?', seatStyle);
    setSeatReservationList(true);

    console.log('seatreservation에서 오피스아이디', officeId);
    console.log('selectedSeatAll', selectedSeatAll);

    const fetchSeatReservationListData = async () => {
      try {
        const res = await API.get(
          `reservation/${officeId}?type=${seatStyle}&start=${rsInfo?.start_date}&end=${rsInfo?.end_date}`,
        );
        console.log('SeatReservationList에서의 요청', res.data.data);
        setSearchRemaining(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    setSelectedSeatAll((prev) => ({
      ...prev,
      type: seatStyle,
      start_date: rsInfo?.start_date,
      end_date: rsInfo?.end_date,
    }));
    fetchSeatReservationListData();
  };
  //수정 요청
  const removeReservation = () => {
    setSelectedSeatAll(null);
  };
  const fetchSeatReservationUpdate = async () => {
    const updateMembership = {
      type: rsInfo?.type,
      start_date: rsInfo?.start_date,
      start_time: rsInfo?.start_time,
      end_time: rsInfo?.end_time,
      end_date: rsInfo?.end_date,
      prise: null,
      seat_id: selectedSeatAll?.code,
    };

    try {
      console.log('seatID', rsInfo?.id);
      console.log('MID', MemberId);
      console.log('업데이트로그', updateMembership);
      const res = await API.put(
        `reservation/individual/my-membership/${MemberId}/reservation/${rsInfo?.id}`,
        updateMembership,
      );
      console.log('SeatReservationList에서의 요청', res.data.data);
      setSearchRemaining(res.data.data);
    } catch (error) {
      console.error('Error updating seat reservation:', error);
    }

    setConfirm(false);
  };

  return (
    <div>
      <div className="h-48px text-20px font-bold mt-3 text-gray-300 cursor-pointer">
        <div className="flex flex-col gap-4 justify-start h-48px w-full mx-auto">
          <p className="text-xl font-bold text-black">자율 좌석 변경</p>

          <p className="text-lg font-bold text-black">
            기존 예약 정보를 확인하세요.
          </p>
          <div className="bg-white w-full h-auto mb-4 rounded-lg cursor-pointer">
            <div className="p-4 flex justify-start">
              <div className="flex flex-col pr-4 border-r-2">
                <div className="text-black font-normal">
                  {rsInfo?.seat_type}
                </div>
                <div className="font-bold text-lg text-black">
                  {rsInfo?.seat_code}
                </div>
              </div>
              <div className="text-black font-normal pl-4">
                {rsInfo?.start_date}
              </div>
            </div>
          </div>
          <p className="text-lg font-bold text-black">
            좌석 유형을 선택하세요.
          </p>
          <div className="flex flex-col mb-4 justify-between">
            <div className="flex w-full">
              {seatTypes.map((seatStyle) => (
                <div
                  key={seatStyle}
                  onClick={() => handleSeatStyleClick(seatStyle)}
                  className={`mb:w-full mr-2 mb:h-auto md:w-[6.29688rem] md:h-[7.75rem] flex flex-col justify-center items-center p-2 gap-2 rounded-lg ${
                    seatStyle === selectedSeatAll?.type
                      ? 'bg-blue-400 text-white'
                      : 'bg-white'
                  }`}
                >
                  <Image
                    width={`${isMobile ? 44 : 64}`}
                    height={`${isMobile ? 44 : 64}`}
                    alt={`${seatStyle}`}
                    src={seatImages[seatStyle]}
                  />
                  <p className="md:text-sm mb:text-[0.525rem] mb:font-bold">
                    {seatStyle}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {selectedSeatAll && (
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold text-black">
                수정하신 예약 정보를 확인해주세요.
              </p>
              <div className="w-full flex flex-col gap-5 bg-white rounded-xl">
                <div className="mb:w-[18rem] md:w-[26.6875rem] mb:h-[4.1875rem] md:h-[5.625rem] bg-white text-lg rounded-xl p-1 pl-2 mb-2">
                  <div className="flex mb:gap-1 md:gap-2 mb:p-2 md:p-4 justify-between">
                    <div className="pr-4 border-gray-300 flex">
                      <div className="pr-4 border-r-2">
                        <p className="mb:text-[0.75rem]  md:text-[1rem] md:leading-7 mb:leading-5">
                          {selectedSeatAll?.type}
                        </p>
                        <p className="mb:text-[0.875rem] md:text-[1.25rem] font-bold ">
                          {selectedSeatAll?.code}
                        </p>
                      </div>
                      <div className="pl-4 md:font-normal md:text-lg mb:text-[0.25rem] mb:leading-5 md:leading-7">
                        <p>{selectedSeatAll?.start_date} ~ </p>
                        <p> {selectedSeatAll?.end_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!isMobile ? (
                        <div className="">
                          <button
                            className="rounded-lg w-[4.625rem] h-[2rem] text-sm text-white font-semibold bg-[#FF4163]"
                            onClick={() => removeReservation()}
                          >
                            선택 취소
                          </button>
                        </div>
                      ) : (
                        <button
                          className="rounded-lg w-[1.75rem] h-[1.75rem] text-sm text-white font-semibold bg-[#FF4163]"
                          onClick={() => removeReservation()}
                        >
                          X
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => fetchSeatReservationUpdate()}
                className="w-full text-center my-4"
              >
                <button className="w-[5.5rem] h-[2.5rem] bg-blue-400 text-white rounded-lg leading-[1.375rem]">
                  수정 하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
