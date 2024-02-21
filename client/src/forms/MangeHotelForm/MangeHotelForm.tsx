import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitesSection";
import GuestSection from "./GuestSection";
import ImageSection from "./ImageSection";
import { HotelType } from "../../../../server/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};
type Props = {
  hotel?: HotelType;
  onSave: (HotelFormData: FormData) => void;
  isLoading: boolean;
};
const MangeHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMenthods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMenthods;
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);
  const onsubmit = handleSubmit((formDataJson: HotelFormData) => {
    // console.log(formData);
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());

    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
    // [img1.png,img2.png,img3.png]
    // imageurls = [imag1.png]
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMenthods}>
      <form className="flex flex-col gap-10" onSubmit={onsubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-lg rounded-lg disabled:bg-gray-500"
            type="submit"
          >
            {isLoading ? " Saving..." : "save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default MangeHotelForm;
