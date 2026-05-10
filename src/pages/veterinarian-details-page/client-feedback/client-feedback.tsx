import React, { useState } from 'react';
import { useGetVeterinarianFeedbackQuery } from '~/store/api/vets/vets-api';
import type { FeedbackSort } from '~/store/api/vets/vets-types';

const ITEMS_PER_PAGE = 4;

type ClientFeedbackProps = {
  veterinarianId: string;
};

const SORT_MAP: Record<'Rating' | 'Date', FeedbackSort> = {
  Rating: 'rating,desc',
  Date: 'date,desc',
};

const toInitials = (value: string): string => {
  const words = value.split(' ').filter(Boolean);

  if (words.length === 0) {
    return 'NA';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const formatDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value || 'Date not available';
  }

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ClientFeedback: React.FC<ClientFeedbackProps> = ({ veterinarianId }) => {
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<'Rating' | 'Date'>('Rating');

  const { data, isFetching, isError } = useGetVeterinarianFeedbackQuery({
    veterinarianId,
    page: activePage,
    size: ITEMS_PER_PAGE,
    sort: SORT_MAP[sortBy],
  });

  const currentReviews = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'Rating' | 'Date');
    setActivePage(1); // reset to page 1 when sorting changes
  };

  const handlePrev = () => setActivePage((p) => Math.max(1, p - 1));
  const handleNext = () => setActivePage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-neutral-0 rounded-2xl p-8 border border-neutral-200 box-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-h2 text-black-900 mb-1">Client Feedback</h2>
          <p className="text-body-s-regular text-black-700">
            Trusted by thousands of families in our community
          </p>
        </div>
        <div className="flex items-center gap-2 text-body-s-regular text-black-700">
          <p>Sort by:</p>
          <select
            id="filter"
            className="border border-green-400 rounded-lg px-3 py-1 text-body-s-regular text-black-900 bg-neutral-0 cursor-pointer hover:bg-neutral-50 transition-colors"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="Rating">Rating</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {isFetching && (
          <p className="text-body-m-regular text-black-900">
            Loading feedback...
          </p>
        )}

        {!isFetching && isError && (
          <p className="text-body-m-regular text-red-700">
            Failed to load feedback. Please refresh and try again.
          </p>
        )}

        {!isFetching && !isError && currentReviews.length === 0 && (
          <p className="text-body-m-regular text-black-900">
            No feedback available yet.
          </p>
        )}

        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="border border-green-400 rounded-2xl p-5 flex flex-col gap-4 bg-neutral-0"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <p className="rounded-full bg-[#EBF9F9] text-black-700 text-body-s-bold px-2 py-1">
                  {toInitials(review.clientName)}
                </p>
                <div>
                  <p className="text-body-m-bold text-black-900">
                    {review.clientName}
                  </p>
                  <p className="text-body-s-regular text-black-700">
                    {review.petLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-body-m-bold text-black-900">
                <span className="text-[#F59E0B]">★</span>
                <span>{review.rating}</span>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-body-s-regular text-black-800 leading-6 flex-1">
              {review.comment || 'No comment provided.'}
            </p>

            {/* Date */}
            <p className="text-body-s-regular text-neutral-500 mt-1">
              {formatDate(review.date)}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          className="text-body-s-regular text-black-800 px-3 py-1 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={activePage === 1}
        >
          ‹ Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-lg text-body-s-regular ${
              activePage === page
                ? 'bg-black-900 text-neutral-0 cursor-pointer hover:bg-black-800 transition-colors'
                : 'bg-transparent text-black-800 cursor-pointer hover:bg-neutral-100 transition-colors'
            }`}
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="text-body-s-regular text-black-800 px-3 py-1 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={activePage === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default ClientFeedback;
