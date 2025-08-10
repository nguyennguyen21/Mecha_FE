interface ContentsProps {
  text: string;
}

const Content: React.FC<ContentsProps> = ({ text }) => {
  return <p className="text-lg">{text}</p>;
};

export default Content;
