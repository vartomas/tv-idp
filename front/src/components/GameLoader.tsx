import { Spin } from 'antd';

const GameLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spin size="default" />
    </div>
  );
};

export default GameLoader;
