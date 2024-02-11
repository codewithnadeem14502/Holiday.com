import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilites: string[];
  imageFiles: FileList;
  adultCount: number;
  childrenCount: number;
};

const MangeHotelForm = () => {
  const formMenthods = useForm<HotelFormData>();
  return (
    <FormProvider {...formMenthods}>
      <form className="flex flex-col gap-10">
        <DetailsSection />
        <TypeSection />
      </form>
    </FormProvider>
  );
};

export default MangeHotelForm;
