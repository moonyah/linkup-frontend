import CategoryDropdown from '@components/club/CategoryDropdown';
import AddClubButton from '@components/club/common/AddClubButton';
import SearchInput from '@components/club/SearchInput';
import { useEffect, useState } from 'react';
import API from '@/utils/axios';
import { ClubCardProps } from '@/app/api/club/fetchClubs';
import Link from 'next/link';

export default function UnapprovedClubs() {
  const [clubs, setClubs] = useState<ClubCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnapprovedClubsData = async (categories: string[] = []) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      categories.forEach((category) => params.append('category', category));

      console.log('Fetching clubs with params:', params.toString());

      const response = await API.get(`/club/authenticated/search`, { params });
      const data = response.data;
      console.log('API Response:', data);

      const fetchedClubs = data.data.content.map((club: any) => ({
        id: club.id,
        member_id: club.member_id,
        member_name: club.member_name,
        profile_image: club.profile_image,
        title: club.title,
        introduction: club.introduction,
        detail_introduction: club.detail_introduction,
        club_thumbnail: club.thumbnail,
        club_type: club.club_type,
        recruit_count: club.recruit_count,
        club_members: club.club_members,
        club_meetings: club.club_meetings
          ? club.club_meetings.map((meeting: any) => ({
              ...meeting,
              dateDiff: calculateDateDiff(meeting.date),
            }))
          : [],
        liked: club.liked,
      }));
      const likedClubs: ClubCardProps[] = fetchedClubs.filter(
        (club: ClubCardProps) => club.liked,
      );

      setClubs(likedClubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (selectedCategories: string[]) => {
    await fetchUnapprovedClubsData(selectedCategories);
  };

  useEffect(() => {
    fetchUnapprovedClubsData();
  }, []);

  function calculateDateDiff(meetingDate: string): string {
    const meetingDateTime = new Date(meetingDate).getTime();
    const currentDateTime = new Date().getTime();
    const diffInMilliseconds = meetingDateTime - currentDateTime;
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return '오늘';
    } else if (diffInDays > 0) {
      return `모임 D-${diffInDays}`;
    } else {
      return `일정 없음`;
    }
  }

  const handleLikeToggle = async (
    clubId: number,
    currentLikedState: boolean,
  ) => {
    try {
      const newLikedState = !currentLikedState;

      await API.post(`/club/${clubId}/like`, { liked: newLikedState });

      fetchUnapprovedClubsData();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  async function fetchClubMembers(clubId: number) {
    try {
      // 클럽 멤버 가져오기
      const response = await API.get(`/club/${clubId}`);
      const data = response.data;
      console.log('data', data);
      const members = [];

      if (data.data.member_id) {
        console.log(data.data.member_id);
        members.push(data.data.member_id);
      }

      if (data.data.club_members && data.data.club_members.length > 0) {
        data.data.club_members.forEach((member: any) => {
          console.log('Member ID:', member.member_id);
          members.push(member.member_id);
        });

        // 내 ID 가져오기
        const myPageResponse = await API.get(`/member/my-page`);
        const myPageData = myPageResponse.data;
        const myId = myPageData.data.id;
        console.log(myId);

        // 내 ID와 일치하는 멤버 확인
        const matchedMembers = members.filter((memberId) => memberId === myId);

        if (matchedMembers.length > 0) {
          console.log('내 ID와 일치하는 멤버가 있습니다.');
          console.log('일치하는 멤버:', matchedMembers);

          // 일치하는 멤버가 있을 때의 처리
          return true;
        } else {
          console.log('내 ID와 일치하는 멤버가 없습니다.');
          // 일치하는 멤버가 없을 때의 처리
          return false;
        }
      } else {
        console.log('No club members found for club ID:', clubId);
        // 클럽 멤버가 없을 때의 처리
        return false;
      }
    } catch (error) {
      console.error('Error fetching club members:', error);
      // 에러 발생 시의 처리
      return false;
    }
  }

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-[2rem] gap-4 md:mt-8 mt-4">
          {clubs.map((club) => (
            <Link href={`/community/club/${club.id}`}>
              <div key={club.id}>
                {/* 모바일 화면 */}
                <div
                  className={`bg-white rounded-t-2xl relative p-4 block md:hidden`}
                >
                  <div className="overflow-hidden relative flex">
                    <div className="w-24 h-24 relative mb:mr-3 mr-2 flex-shrink-0">
                      <img
                        src="/images/club/example.jpg"
                        alt={club.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center pb-1">
                        <h3 className="font-bold text-sm truncate">
                          {club.title}
                        </h3>
                      </div>
                      <p className="text-ellipsis overflow-hidden text-xs line-clamp-2">
                        {club.introduction}
                      </p>
                      <div className="text-xs mt-2 flex gap-2">
                        <div className="flex items-center font-bold">
                          <img
                            src="/svg/club/peoplesIcon.svg"
                            alt="Peoples Icon"
                            className="mr-[.25rem] w-4"
                          />
                          {club.club_members?.length || 0}/{club.recruit_count}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-4 font-semibold">
                    <div className="flex gap-4">
                      <div className="bg-yellow-600 p-[0.5rem] rounded leading-none">
                        {club.club_type}
                      </div>
                      {club.club_meetings.length > 0 && (
                        <div className="bg-yellow-600 p-[0.5rem] rounded leading-none">
                          {calculateDateDiff(club.club_meetings[0].date)}
                        </div>
                      )}
                    </div>
                    <button
                      className="mr-2"
                      onClick={(e) => {
                        e.preventDefault(); // 이벤트 전파 막기
                        handleLikeToggle(club.id, club.liked);
                      }}
                    >
                      <img
                        src={
                          club.liked
                            ? '/svg/club/bookmarkedHeart.svg'
                            : '/svg/club/unbookmarkedHeart.svg'
                        }
                        alt="Heart Icon"
                        className="w-7 h-7"
                      />
                    </button>
                  </div>
                </div>
                <button className="w-full bg-red-cancel text-white md:py-[1.3rem] py-4 leading-none md:text-base text-sm font-medium rounded-b-2xl md:hidden">
                  신청 취소
                </button>
                {/* PC 화면 */}
                <div
                  className={`hidden md:block bg-white rounded-t-lg overflow-hidden relative`}
                >
                  <div className="h-[22.4rem] relative">
                    <img
                      src="/images/club/example.jpg"
                      alt={club.title}
                      className="object-cover absolute inset-0 "
                    />
                    <div className="absolute bottom-0 w-full p-4 bg-white backdrop-blur-sm">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold"> {club.title}</h3>
                        <button
                          className="mr-2"
                          onClick={(e) => {
                            e.preventDefault(); // 이벤트 전파 막기
                            handleLikeToggle(club.id, club.liked);
                          }}
                        >
                          <img
                            src={
                              club.liked
                                ? '/svg/club/bookmarkedHeart.svg'
                                : '/svg/club/unbookmarkedHeart.svg'
                            }
                            alt="Heart Icon"
                            className="w-7 h-7"
                          />
                        </button>
                      </div>
                      <p className="mt-2 overflow-hidden overflow-ellipsis">
                        {club.introduction}
                      </p>
                      <div className="text-xs mt-2 flex gap-4">
                        <div className="flex items-center">
                          <img
                            src="/svg/club/peoplesIcon.svg"
                            alt="Peoples Icon"
                            className="mr-1"
                          />
                          {club.club_members?.length || 0}/{club.recruit_count}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-2 font-semibold">
                        <div className="flex gap-4">
                          <div className="bg-yellow-600 p-[0.5rem] rounded">
                            {club.club_type}
                          </div>
                          {club.club_meetings.length > 0 && (
                            <div className="bg-yellow-600 p-[0.5rem] rounded leading-none">
                              {calculateDateDiff(club.club_meetings[0].date)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-red-cancel text-white py-[1.3rem] leading-none text-xl rounded-b-lg font-medium hidden md:block">
                  신청 취소
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
