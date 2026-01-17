import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-clients";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useAppContext } from "../contexts/AppContext";

const MyHotels = () => {
  const { showToast } = useAppContext();

  const { data: hotelData, refetch } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    },
  );

  const deleteHotel = useMutation(apiClient.deleteMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Deleted!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Deleting Hotel", type: "ERROR" });
    },
  });

  useEffect(() => {
    if (deleteHotel.isSuccess) {
      refetch();
    }
  }, [deleteHotel.isSuccess, refetch]);

  const handleDelete = (hotelId: string) => {
    deleteHotel.mutate(hotelId);
  };

  if (!hotelData) {
    return <span>No Hotel Found</span>;
  }

  return (
    <div className="space-y-5 p-2 md:p-0">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded-lg"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />₹{hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded-lg"
              >
                View Details
              </Link>
              <button
                onClick={() => handleDelete(hotel._id)}
                className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
