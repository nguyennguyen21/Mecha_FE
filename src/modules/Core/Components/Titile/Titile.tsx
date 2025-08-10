interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return <h1 className="text-4xl font-bold">{text}</h1>;
};

export default Title;
