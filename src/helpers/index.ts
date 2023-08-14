export const fetchImage = async (url: string) => {
  return fetch(url).then(res => {
    if (!res.ok) {
      return Promise.reject({ status: res.status });
    }

    return res.blob();
  });
};
