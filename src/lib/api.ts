"use server"
import axios from "axios";
import { cookies } from "next/headers";

// Fonction helper pour obtenir le token et configurer les headers
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
  };
};

// Fonction pour faire des requêtes GET avec authentification
export const fetchJSON = async (url: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error: any) {
    console.error("Erreur fetchJSON:", error?.response?.data || error.message);
    throw error;
  }
};

// Fonction pour créer ou mettre à jour des données
export const createdOrUpdated = async ({
  url,
  data,
  updated = false,
}: {
  url: string;
  data: any;
  updated?: boolean;
}) => {
  try {
    const headers = await getAuthHeaders();

    const response = updated
      ? await axios.put(url, data, { headers })
      : await axios.post(url, data, { headers });

    return response.data;
  } catch (error: any) {
    console.error("Erreur createdOrUpdated:", error?.response?.data || error.message);
    throw error;
  }
};

// Fonction pour supprimer des données
export const deleteWithAxios = async ({ url }: { url: string }) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.delete(url, { headers });

    return response.data;
  } catch (error: any) {
    console.error("Erreur deleteWithAxios:", error?.response?.data || error.message);
    throw error;
  }
};
