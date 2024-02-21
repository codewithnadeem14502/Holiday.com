import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./MangeHotelForm";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const exisitingImageUrls = watch("imageUrls");
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrls: String
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      exisitingImageUrls.filter((url) => url != imageUrls)
    );
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Images</h1>
      <div className="border rounded p-4 flex-col gap-4">
        {exisitingImageUrls && (
          <div className="grid grid-cols-6 gap-4 py-5">
            {exisitingImageUrls.map((url) => (
              <div className="relative group ">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*
          "
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (exisitingImageUrls?.length || 0);

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
