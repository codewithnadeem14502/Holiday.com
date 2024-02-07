import * as apiClient from "../api-clients";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
const SignOutButton = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(apiClient.SignOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Sign Out", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const handleSignOut = () => {
    mutation.mutate();
  };
  return (
    <button
      className="flex  bg-white items-center text-blue-600 px-3 font-bold rounded-lg hover:bg-gray-100"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
