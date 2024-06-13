'use client';
import API from '@/utils/axios';
import { useEffect, useState } from 'react';
import {
  confirmModalState,
  rsInfoState,
  selectedMembershipId,
  selectedOfficeId,
  userMembershipListState,
} from '@/app/(search)/atom/membership';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import SeatInformation from '../../../[id]/components/SeatInfomation';
import ConfirmModal from '@/app/(search)/map/components/Loader/ConfirmModal';
import {
  loadingState,
  mobileReservationLayoutState,
  showMobileTableState,
} from '@/app/(search)/atom/media';
import FullPageLoader from '@/app/(search)/map/components/Loader/FullPageLoader';
import { modalState } from '@/app/(search)/atom/search';
import { ReservationDelete } from '../../../[id]/components/table/modal/ReservationSuccess';
import SeatReservationList from '../../components/SeatReservationList';
import SpaceReservationList from '../../components/SpaceReservationList';
import EnterReservationList from '../../components/EnterReservationList';
import ReservedList from '../../components/ReservedList';
import ResertorySkeleton, {
  ResertoryTitleSkeleton,
} from '../../components/skeleton/resertorySkeleton';
import OpenDeskMobile from '../../../[id]/components/table/mobile/OpenDeskMobile';
import OpenTableMobile from '../../../[id]/components/table/mobile/OpenTableMobile';

export default function Resertory() {
  const membershipId = useRecoilValue(selectedMembershipId);
  // console.log('멤버십 아이디', membershipId[0]);
  // const setMembershipId = useSetRecoilState(selectedMembershipId);
  // 하나의 멤버십 전체 조회
  const setUserReservationList = useSetRecoilState(userMembershipListState);
  const userReservationList = useRecoilValue(userMembershipListState);
  const [modal, setModal] = useRecoilState(modalState);
  const rsInfo = useRecoilValue(rsInfoState);
  const setRsInfo = useSetRecoilState(rsInfoState);
  const [renderType, setRenderType] = useState<string | null>(null);
  const office_id = useRecoilValue(selectedOfficeId);
  const isMobile = useRecoilValue(mobileReservationLayoutState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);
  const [showMobileTable, setShowMobileTable] =
    useRecoilState(showMobileTableState);
  //예약 수정 취소 처리
  const RenderListUI = (rstype: string) => {
    switch (rstype) {
      case '자율 좌석':
        return <SeatReservationList seatTypes={seatTypes} />;
      case '공간':
        return <SpaceReservationList spaceTypes={spaceTypes} />;
      case '기업 지정석':
        return <EnterReservationList seatTypes={seatTypes} />;
      case '지정석':
        return <ReservedList seatTypes={seatTypes} />;
      default:
        return null;
    }
  };
  const seatImages: Record<string, string> = {
    오픈데스크: '/svg/reservation/opendesk.svg',
    포커스데스크: '/svg/reservation/focusdesk.svg',
    '1인실': '/svg/reservation/oneroom.svg',
    모니터데스크: '/svg/reservation/monitordesk.svg',
  };
  const spaceImages: Record<string, string> = {
    '미팅룸(4인)': '/svg/reservation/mettingRoom4.svg',
    '미팅룸(8인)': '/svg/reservation/mettingRoom8.svg',
    컨퍼런스룸: '/svg/reservation/seminar.svg',
    스튜디오: '/svg/reservation/studio.svg',
  };
  const seatTypes = ['오픈데스크', '포커스데스크', '1인실', '모니터데스크'];
  const spaceTypes = ['미팅룸(4인)', '미팅룸(8인)', '컨퍼런스룸', '스튜디오'];

  // 예약 취소
  const handleCancelClick = async (
    reservationId: number,
    reservationType: string,
  ) => {
    try {
      const res = await API.delete(
        `reservation/individual/my-membership/${membershipId}/reservation/${reservationId}`,
      );
      console.log('삭제햇다');
      setRsInfo(res.data.data);
      // setRenderType(rstype);
      setModal(true);
    } catch (error) {
      console.error('Error fetching reservation info:', error);
    }
  };

  // 예약 수정
  const handleRsClick = async (
    reservationId: number,
    reservationType: string,
  ) => {
    console.log('membershipId:', membershipId, 'reservationId:', reservationId);
    try {
      const res = await API.get(
        `reservation/individual/my-membership/${membershipId}/reservation/${reservationId}`,
      );
      console.log('Selected reservation info:', res.data.data);
      setRsInfo(res.data.data);
      setRenderType(reservationType);
      // setRenderResertorySeatInfomation
    } catch (error) {
      console.error('Error fetching reservation info:', error);
    }
  };
  const freeSeat = userReservationList.filter(
    (reservation) => reservation.type === '자율 좌석',
  );
  const space = userReservationList.filter(
    (reservation) => reservation.type === '공간',
  );
  const reserved = userReservationList.filter(
    (reservation) => reservation.type === '지정석',
  );

  useEffect(() => {
    // 개인멤버십 하나의 예약 전체 조회
    console.log('membershipId', membershipId);
    const fetchAllReservationData = async () => {
      try {
        const res = await API.get(
          `reservation/individual/my-membership/${membershipId}`,
        );
        console.log('응', res.data.data);
        setUserReservationList(res.data.data);
      } catch (error) {
        console.error('allmymembership req error', error);
      }
    };

    fetchAllReservationData();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // }, [membershipId]);

  console.log('안녕');

  return (
    <>
      {loading && <FullPageLoader />}

      {!showMobileTable && (
        <div className="mt-[5rem] md:w-[95rem] mx-auto pt-2 md:flex justify-center gap-4">
          <div className="flex flex-col bg-[#E4EEFF] mb:w-[90%] md:px-8 max-md:w-[30.6875rem] mb:px-4 overflow-y-scroll scrollbar-hide rounded-3xl pt-4 h-[51.25rem] mx-auto">
            {!rsInfo && (
              <div className="h-48px text-20px font-bold mt-3 text-gray-300 cursor-pointer">
                <div className="flex flex-col gap-4 justify-start h-48px w-full mx-auto">
                  {loading && <ResertoryTitleSkeleton />}
                  {!loading && (
                    <>
                      <p className="text-xl font-bold text-gray-800 mt-4">
                        기존 예약 정보를 확인하세요.
                      </p>
                      <p className="text-lg font-semibold text-gray-600 ">
                        자율 좌석
                      </p>
                    </>
                  )}
                  {loading &&
                    freeSeat.map((seat, i) => <ResertorySkeleton key={i} />)}
                  {!loading &&
                    freeSeat.map((reservation, index) => (
                      <div
                        onClick={() =>
                          handleRsClick(reservation.id, reservation.type)
                        }
                        key={index}
                        className="bg-white w-full h-auto mb-4 rounded-lg cursor-pointer"
                      >
                        <div className="p-4 flex justify-start">
                          <div className="flex flex-col pr-4 border-r-2 w-1/3 p-2 ">
                            <div className="text-black font-normal ">
                              {reservation.seat_type}
                            </div>
                            <div className="font-bold text-lg text-black mt-1">
                              {reservation.seat_code}
                            </div>
                          </div>
                          <div className="flex justify-between w-full ">
                            <div className="text-black font-normal pl-4 p-2">
                              {reservation.start_date}
                            </div>
                            <div className="flex gap-2 justify-between">
                              <button
                                onClick={() =>
                                  handleCancelClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-950 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 취소
                              </button>
                              <button
                                onClick={() =>
                                  handleRsClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-500 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 수정
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {loading &&
                    reserved.map((reserved, i) => (
                      <ResertorySkeleton key={i} />
                    ))}
                  {!loading &&
                    reserved.map((reservation, index) => (
                      <div
                        onClick={() =>
                          handleRsClick(reservation.id, reservation.type)
                        }
                        key={index}
                        className="bg-white  shadow-xl w-full h-auto mb-4 rounded-lg cursor-pointer"
                      >
                        <div className="p-4 flex justify-start">
                          <div className="flex flex-col pr-4 border-r-2 w-1/3 p-2 ">
                            <div className="text-black font-normal ">
                              {reservation.seat_type}
                            </div>
                            <div className="font-bold text-lg text-black">
                              {reservation.seat_code}
                            </div>
                          </div>
                          <div className="flex justify-between w-full ">
                            <div className="text-black font-normal pl-4">
                              {reservation.start_date}
                            </div>
                            <div className="flex flex-col justify-between">
                              <button
                                onClick={() =>
                                  handleCancelClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-950 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 취소
                              </button>
                              <button
                                onClick={() =>
                                  handleRsClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-500 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 수정
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="border border-gray-300"></div>

                  {loading && <ResertoryTitleSkeleton />}
                  {!loading && (
                    <p className="text-lg font-semibold text-gray-600 ">공간</p>
                  )}

                  {loading &&
                    space.map((seat, i) => <ResertorySkeleton key={i} />)}
                  {!loading &&
                    space.map((reservation, index) => (
                      <div
                        onClick={() =>
                          handleRsClick(reservation.id, reservation.type)
                        }
                        key={index}
                        className="bg-white w-full h-auto mb-4 rounded-lg cursor-pointer"
                      >
                        <div className="p-4 flex justify-start">
                          <div className="flex flex-col pr-4 border-r-2  w-1/3 p-2 ">
                            <div className="text-black font-normal">
                              {reservation.seat_type}
                            </div>
                            <div className="font-bold text-lg text-black mt-1">
                              {reservation.seat_code}
                            </div>
                          </div>
                          <div className="flex justify-between w-full ">
                            <div className="text-black font-normal pl-4 p-2">
                              {reservation.start_date}
                            </div>
                            <div className="flex gap-2 justify-between">
                              <button
                                onClick={() =>
                                  handleCancelClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-950 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 취소
                              </button>
                              <button
                                onClick={() =>
                                  handleRsClick(
                                    reservation.id,
                                    reservation.type,
                                  )
                                }
                                className="bg-blue-500 text-white rounded-2xl px-2 text-sm h-auto py-2"
                              >
                                예약 수정
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {renderType && RenderListUI(renderType)}
          </div>
          <SeatInformation />
        </div>
      )}
      {showMobileTable && <OpenTableMobile />}
      <div className="absolute right-[5.44rem] top-[2rem] z-[201]">
        {modal && <ReservationDelete />}
      </div>
    </>
  );
}
