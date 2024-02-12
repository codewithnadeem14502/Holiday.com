import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./MangeHotelForm";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Images</h1>
      <div className="border rounded p-4 flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*
          "
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length;

              if (totalLength === 0) {
                return "At least one Image should be added";
              }
              if (totalLength > 6) {
                return "Total number of images cannot be more than 6 ";
              }
            },
          })}
        />
      </div>

      {errors.imageFiles && (
        <span className="text-red-500 font-bold text-sm">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};
export default ImageSection;
