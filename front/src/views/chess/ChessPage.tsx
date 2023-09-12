import { useParams } from 'react-router-dom';

const ChessPage = () => {
  const params = useParams();

  return <>chess game: {params.gameId}</>;
};

export default ChessPage;
