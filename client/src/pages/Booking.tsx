import { useQuery } from "react-query";
import * as apiClient from "../api-clients";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    },
  );

  if (!hotel) {
    return <></>;
  }
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />

      <div className="flex items-center justify-center p-6">
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800">
            Payments Coming Soon 🚧
          </h2>
          <p className="mt-2 text-sm text-yellow-700">
            Online payments are temporarily unavailable.
            <br />
            We’re currently onboarding our payment provider.
          </p>
          <p className="mt-1 text-sm text-yellow-700">
            Please check back later or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
