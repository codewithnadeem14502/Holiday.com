import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  UserType,
} from "../../server/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {

  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  // fetch route

  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    // converting the data in json format
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
export const SignIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Login failed");
  }

  //  Store token
  localStorage.setItem("token", body.token);

  return body;
};
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("token invalid")
    throw new Error("Token invalid");
  }

  return response.json();
};


export const SignOut = async () => {
  localStorage.removeItem("token");
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during SignOut");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};
export const fetchMyHotelId = async (hotelId: string): Promise<HotelType> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching hotel");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFromData: FormData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFromData.get("hotelId")}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: hotelFromData,
  });
  if (!response.ok) {
    throw new Error("Failed to Update hotel ");
  }

  return response.json();
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {

      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};
export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};
export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};
export const deleteMyHotelById = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "DELETE",

  });

  if (!response.ok) {
    throw new Error("Failed to delete hotel");
  }
};
