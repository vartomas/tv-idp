export const getChannels = async () => {
  const res = await fetch('api/Chat/GetChannels');
  return res.json();
};
