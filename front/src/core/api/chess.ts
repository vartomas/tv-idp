export const getChessGameDetails = async (gameId: number) => {
  const res = await fetch(`api/Chess/GetChessGameDetails?gameId=${gameId}`);
  return res.json();
};
