import React, { useEffect, useRef, useState } from 'react';

interface CategoryDropdownProps {
  onSearch: (selectedTopics: string[]) => void;
}

export default function CategoryDropdown({ onSearch }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchBoxVisible, setSearchBoxVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const topics = [
    '운동/스포츠',
    '직무계발',
    '외국어',
    '문화/예술',
    '여행',
    '봉사활동',
    '미디어 관람',
    '경제/재테크',
    '기타',
  ];

  const handleTopicSelect = (topic: string) => {
    const alreadySelected = selectedTopics.includes(topic);

    if (alreadySelected) {
      setSelectedTopics((prev) =>
        prev.filter((selectedTopic) => selectedTopic !== topic),
      );
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
    }

    setSearchBoxVisible(true);
  };

  const removeTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.filter((selectedTopic) => selectedTopic !== topic),
    );
  };

  const resetSelection = () => {
    setSelectedTopics([]);
    setSearchBoxVisible(false);
  };

  const handleSearch = () => {
    // 검색하기 버튼을 클릭할 때 선택된 주제를 부모 컴포넌트로 전달
    onSearch(selectedTopics);
    // Dropdown을 닫음
    setIsOpen(false);
    console.log('선택된 주제들:', selectedTopics);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" md:h-[2.38rem] h-[2rem] font-semibold md:text-lg text-xs bg-white px-2 flex items-center justify-center rounded border border-gray-200"
      >
        <span>카테고리</span>
        <img
          src="/svg/club/arrowDown.svg"
          alt="Arrow Down Icon"
          className="w-5 h-5 ml-4"
        />
      </button>
      {isOpen && (
        <div className="absolute mt-2 md:py-[2.5rem] p-[1.5rem] md:w-[34rem] w-[18rem] bg-white border rounded-lg shadow-lg">
          {/* 주제 버튼 */}
          <div className="md:grid md:grid-cols-5 md:gap-2 grid grid-cols-3 gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                className={`py-[0.5rem] rounded-lg border md:w-[5.4372rem] md:text-sm text-xs ${
                  selectedTopics.includes(topic) ? 'bg-blue-400 text-white' : ''
                }`}
                onClick={() => handleTopicSelect(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* 회색 선 */}
          <hr className="my-7 border-t border-gray-300" />

          {/* 선택된 주제 */}
          {searchBoxVisible && selectedTopics.length > 0 && (
            <div className="">
              <div className="">
                <button
                  onClick={resetSelection}
                  className="px-2 pb-3 rounded-lg flex items-center"
                >
                  선택 초기화
                  <img
                    src="/svg/club/reset.svg"
                    alt="Reset Icon"
                    className="pl-2"
                  />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pb-5">
                {selectedTopics.map((topic, index) => (
                  <div key={index} className="">
                    <button className="py-[0.5rem] rounded-lg border md:text-sm text-xs flex px-2 justify-between">
                      {topic}
                      <div onClick={() => removeTopic(topic)} className="ml-2">
                        ✕
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center">
            <button
              onClick={handleSearch}
              className="bg-blue-400 text-white px-6 py-2 rounded-lg mt-4"
            >
              검색하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
