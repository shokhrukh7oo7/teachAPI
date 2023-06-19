function request(url, config) {
  return new Promise(async (resolve, reject) => {
    let resJson = await fetch(EDDPOINT + url, config);
    if (resJson.ok) {
      let data = await resJson.json();
      resolve(data);
    } else {
      reject("Error");
    }
  });
}

const axiosInstance = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
});

