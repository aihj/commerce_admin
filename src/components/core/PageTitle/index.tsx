interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="text-32 font-bold text-secondary-darkest leading-38">
      {title}
    </div>
  );
};

export { PageTitle };
