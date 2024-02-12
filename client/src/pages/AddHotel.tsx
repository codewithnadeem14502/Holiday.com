import { useMutation } from "react-query";
import MangeHotelForm from "../forms/MangeHotelForm/MangeHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-clients";
const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel ", type: "ERROR" });
    },
  });
  const handleSave = (hotelFomData: FormData) => {
    mutate(hotelFomData);
  };
  return <MangeHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
