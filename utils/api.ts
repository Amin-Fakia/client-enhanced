export const apiFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  