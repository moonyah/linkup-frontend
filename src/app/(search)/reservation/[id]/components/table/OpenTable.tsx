import Image from 'next/image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  seatListReservation,
  selectedSeatAllState,
  confirmedState,
  searchRemainingState,
  infoMsgState,
  reservationErrorMsgState,
} from '@/app/(search)/atom/office';
import { currentBuildingState } from '@/app/(search)/atom/search';
import { userUpdateRlistPutState } from '@/app/(search)/atom/membership';
import { useEffect, useState } from 'react';
import { loadingState } from '@/app/(search)/atom/media';
import FullPageLoader from '@/app/(search)/map/components/Loader/FullPageLoader';
import TimeSkeleton from '../skeleton/TimeSkeleton';

export default function OpenTable() {
  const seatReservationList = useRecoilValue(userUpdateRlistPutState);
  const [selectedSeatAll, setSelectedSeatAll] =
    useRecoilState(selectedSeatAllState);
  const [confirm, setConfirm] = useRecoilState(confirmedState);
  const [seatList, setSeatList] = useRecoilState(seatListReservation);
  const [remaining, setSearchRemaining] = useRecoilState(searchRemainingState);
  const currentOffice = useRecoilValue(currentBuildingState);
  const id = currentOffice?.id;
  const [loading, setLoading] = useRecoilState(loadingState);
  const [seatClick, setSeatClick] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setSelectedSeatAll((prev) => ({
      ...prev,
      code: '',
    }));
    setSeatClick(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [setLoading]);

  const handleSeatClick = (seatNumber: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('seatId', seatNumber);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', url);

    if (
      selectedSeatAll &&
      seatList.some((seat) => seat.code === selectedSeatAll.code)
    ) {
      // setSelectedSeatAll(null);
    } else if (!selectedSeatAll?.start_date) {
      // setSelectedSeatAll(null);
    }

    setSelectedSeatAll((prev) => ({
      ...prev,
      code: seatNumber,
      start_date: prev?.start_date || ' ',
      end_date: prev?.end_date || '',
      type: prev?.type || '',
    }));
  };

  const handleSeatReady = () => {
    if (
      selectedSeatAll?.start_date &&
      selectedSeatAll?.end_date &&
      selectedSeatAll?.type &&
      selectedSeatAll?.code
    ) {
      if (seatList.length < 5) {
        if (!seatList.some((seat) => seat.code === selectedSeatAll.code)) {
          setSeatList([...seatList, { ...selectedSeatAll }]);

          setConfirm(true);
        }
      }
    }
  };

  return (
    <>
      {Array.isArray(remaining) ? (
        seatReservationList ? (
          <div
            className={`hidden-360 flex flex-col justify-end w-[61.8125rem] h-[51.25rem] relative overflow-hidden`}
          >
            <div className="mb:h-[18.3125rem] md:w-[61.8126rem] md:h-[51.25rem] absolute inset-0">
              <div className="h-[510px] overflow-auto">
                <Image
                  src="/svg/reservation/imageView/openDesk.svg"
                  width={989}
                  height={510}
                  alt="오피스이미지"
                />
                {isExpanded ? (
                  <Image
                    src="/svg/map/arrow.svg"
                    width={20}
                    height={20}
                    alt="업 아이콘"
                  />
                ) : (
                  <Image
                    className="rotate-180"
                    src="/svg/map/arrow.svg"
                    width={20}
                    height={20}
                    alt="업 아이콘"
                  />
                )}
              </div>
            </div>

            <div
              className={`relative flex gap-4 h-[19.375rem] bg-[#E4EEFF] p-8 transition-transform duration-500 transform rounded-xl shadow-xl ${
                isExpanded ? '-translate-y-[-5px]' : 'translate-y-[70%]'
              }`}
            >
              <div className="flex flex-col gap-4 w-[44.5rem]">
                {loading ? null : (
                  <>
                    <p className="text-[1.25rem] font-semibold">좌석 선택</p>

                    <div className="flex flex-wrap gap-2">
                      {remaining.map((seat, i) => (
                        <div key={i}>
                          <button
                            onClick={
                              seat.available
                                ? () => handleSeatClick(seat.id)
                                : undefined
                            }
                            className={`rounded-lg w-[4rem] h-[2.5rem] ${
                              seat.available === true
                                ? 'bg-white text-black'
                                : 'bg-gray-400 text-black'
                            }`}
                            disabled={!seat.available}
                          >
                            {seat.code}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 justify-start">
                <p className="text-[1.25rem] font-semibold ">예약 정보</p>
                <div className="flex flex-col gap-2 justify-between p-4 bg-white w-[12.3125rem] h-[13rem] rounded-lg">
                  <div>
                    <p className="text-[0.75rem] text-gray-300">날짜</p>
                    <div>{selectedSeatAll?.start_date}</div>
                    <div className="flex gap-3">
                      <div className="pr-2 border-r-[0.1rem] border-gray-300">
                        <p className="text-[0.75rem] text-gray-300 ">
                          공간유형
                        </p>
                        <div>{selectedSeatAll?.type}</div>
                      </div>
                      <div>
                        <p className="text-gray-300 text-[0.75rem]">공간번호</p>
                        <div>{selectedSeatAll?.code}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSeatReady}
                    className={`rounded-xl text-white w-[10.3125rem] h-[2.5rem] ${selectedSeatAll?.code ? 'bg-[#688AF2]' : 'bg-[#D3D3D3]'}`}
                  >
                    확정
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          //여기야아아

          <div className="hidden-360  overflow-hidden  flex flex-col justify-end w-[61.8125rem] h-[51.25rem] relative  rounded-md">
            <div className=" mb:h-[18.3125rem] md:w-[61.8126rem] md:h-[51.25rem] absolute inset-0">
              <Image
                src="/svg/reservation/imageView/openDesk.svg"
                layout="fill"
                objectFit="cover"
                alt="오피스이미지"
              />
              <div
                onClick={() => handleClick()}
                className="absolute bottom-0  shadow-2xl left-[50%] transform -translate-y-1/2 bg-[#688AF2] text-gray-500 rounded-[50%] p-4 z-10"
              >
                {isExpanded ? (
                  <Image
                    src="/svg/map/arrow.svg"
                    width={20}
                    height={20}
                    alt="업 아이콘"
                  />
                ) : (
                  <Image
                    className="rotate-180"
                    src="/svg/map/arrow.svg"
                    width={20}
                    height={20}
                    alt="업 아이콘"
                  />
                )}
              </div>
            </div>

            <div
              className={`relative flex gap-4 h-[19.375rem] bg-[#E4EEFF] p-8 transition-transform duration-500 transform rounded-xl shadow-xl ${
                isExpanded ? '-translate-y-[-5px]' : 'translate-y-[70%]'
              }`}
            >
              <div className="flex flex-col gap-4 w-[44.5rem]">
                <p className="text-[1.25rem] font-semibold">좌석 선택</p>
                <div className="flex flex-wrap gap-2">
                  {loading &&
                    remaining.map((item, idx) => (
                      <div key={idx}>
                        <TimeSkeleton />
                      </div>
                    ))}
                  {!loading &&
                    remaining.map((seat, i) => (
                      <div key={i}>
                        <button
                          onClick={() => handleSeatClick(seat.id)}
                          className={`rounded-lg w-[4rem] h-[2.5rem] ${
                            seatClick === true ? 'bg-[#688AF2]' : 'bg-white'
                          } ${
                            seat.available === false
                              ? 'bg-gray-400 text-black'
                              : selectedSeatAll?.code === seat.code
                                ? 'bg-[#688AF2] text-white'
                                : 'bg-white'
                          }`}
                        >
                          {seat.code}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 justify-start">
                <p className="text-[1.25rem] font-semibold">예약 정보</p>
                {/* {loading && <ReservationMiniInfo />} */}

                <div className="flex flex-col gap-2 justify-between p-4 bg-white w-[12.3125rem] h-[13rem] rounded-lg">
                  <div>
                    <p className="text-[0.75rem] text-gray-300">날짜</p>
                    <div>{selectedSeatAll?.start_date}</div>
                    <div className="flex gap-3">
                      <div className="pr-2 border-r-[0.1rem] border-gray-300">
                        <p className="text-[0.75rem] text-gray-300">공간유형</p>
                        <div>{selectedSeatAll?.type}</div>
                      </div>
                      <div>
                        <p className="text-gray-300 text-[0.75rem]">공간번호</p>
                        <div>{selectedSeatAll?.code}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSeatReady}
                    className={`rounded-xl text-white w-[10.3125rem] h-[2.5rem] ${selectedSeatAll?.code ? 'bg-[#688AF2]' : 'bg-[#D3D3D3]'} `}
                  >
                    확정
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div>Error: Remaining is not an array.</div>
      )}
      {loading && <FullPageLoader />}
    </>
  );
}
