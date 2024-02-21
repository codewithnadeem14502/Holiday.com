import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-clients";
import MangeHotelForm from "../forms/MangeHotelForm/MangeHotelForm";
import { useAppContext } from "../contexts/AppContext";
const EditHotel = () => {
  const { showToast } = useAppContext();
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchMyHotelId",
    () => apiClient.fetchMyHotelId(hotelId || ""),
    {
      // check for truly value
      enabled: !!hotelId,
    }
  );
  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFromData: FormData) => {
    mutate(hotelFromData);
  };
  return (
    <MangeHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
};
export default EditHotel;
