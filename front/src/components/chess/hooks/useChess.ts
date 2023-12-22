import { useEffect, useState } from 'react';
import { ChessFigure, ChessGameDto, FigureMoveDto, FigurePosition, GameStartMessage } from '../chessModel';
import { isSamePosition, startingPositions } from '../utils/figure';
import { getFigureMoves } from '../utils/figureMoves';
import { getChessGameDetails } from '../../../core/api/chess';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '../../../core/state/useConnection';

export const useChess = (gameId: number) => {
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>();
  const [figuresPositions, setFiguresPositions] = useState<ChessFigure[]>(startingPositions);
  const [selectedFigure, setSelectedFigure] = useState<ChessFigure | null>(null);
  const [myTurn, setMyTurn] = useState<boolean>(false);

  const connection = useConnection((state) => state.connection);

  const { isLoading } = useQuery<ChessGameDto>({
    queryKey: [`chessGameDetails-${gameId}}`],
    queryFn: () => getChessGameDetails(gameId),
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      setPlayerColor(data.color);
    },
  });

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveGameStart', (message: GameStartMessage) => {
        console.log('ReceiveGameStart', message);
        setMyTurn(message.currentTurn);
      });
      connection.on('ReceiveOpponentMove', (message: FigureMoveDto) => {
        console.log('ReceiveOpponentMove', message);
        opponentMoveFigure([message.from.column, message.from.row], [message.to.column, message.to.row]);
      });
    }
  }, [connection, gameId, myTurn]);

  const selectFigure = (position: FigurePosition) => {
    if (!myTurn) {
      return;
    }

    const foundFigure = figuresPositions.find((figure) => isSamePosition(figure.position, position));

    const opponentFigure = foundFigure && foundFigure.color !== playerColor;
    if (opponentFigure) {
      return;
    }

    if (selectedFigure && foundFigure && foundFigure.id === selectedFigure.id) {
      setSelectedFigure(null);
      return;
    }

    setSelectedFigure(foundFigure || null);
  };

  const possibleMoves = !!selectedFigure && getFigureMoves(selectedFigure, figuresPositions);

  const moveFigure = async (position: FigurePosition) => {
    const figureInPosition = figuresPositions.find((figure) => isSamePosition(figure.position, position));

    const updatedPositions = figuresPositions.map((x) => {
      if (x.id === selectedFigure?.id) {
        return {
          ...x,
          position,
          hasMoved: true,
        };
      }

      return x;
    });

    if (figureInPosition) {
      const index = figuresPositions.findIndex((figure) => figure.id === figureInPosition.id);
      updatedPositions.splice(index, 1);
    }

    try {
      if (connection?.state === 'Connected' && selectedFigure?.position) {
        const moveDto: FigureMoveDto = {
          from: { column: selectedFigure.position[0], row: selectedFigure.position[1] },
          to: { column: position[0], row: position[1] },
        };
        await connection.send('makeMove', gameId, moveDto);
      }
    } catch (err) {
      console.error(err);
    }

    setSelectedFigure(null);
    setFiguresPositions(updatedPositions);
    setMyTurn(false);
  };

  const opponentMoveFigure = (from: FigurePosition, to: FigurePosition) => {
    const movingFigure = figuresPositions.find((figure) => isSamePosition(figure.position, from));

    const updatedPositions = figuresPositions.map((x) => {
      if (x.id === movingFigure?.id) {
        return {
          ...x,
          position: to,
          hasMoved: true,
        };
      }

      return x;
    });

    const figureInTargetPosition = figuresPositions.find((figure) => isSamePosition(figure.position, to));
    if (figureInTargetPosition) {
      const index = figuresPositions.findIndex((figure) => figure.id === figureInTargetPosition.id);
      updatedPositions.splice(index, 1);
    }

    setFiguresPositions(updatedPositions);
    setMyTurn(true);
  };

  return { playerColor, selectedFigure, possibleMoves, figuresPositions, isLoading, selectFigure, moveFigure };
};
