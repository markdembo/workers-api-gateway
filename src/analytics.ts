export const track_api_call = (user: string, path: string, mixpanel_project_token: string): Promise<Response> => {
  const data = {
    event: "apiCall",
    properties: {
      token: mixpanel_project_token,
      distinct_id: user,
      path: path
    },
  };



  const options: RequestInit = {
    method: "POST",
    headers: { Accept: "text/plain", "Content-Type": "application/json" },
    body: JSON.stringify([data]),
  };
  return fetch("https://api-eu.mixpanel.com/track", options);
};
