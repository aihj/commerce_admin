import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import Link from 'next/link';

type ImageCardTypes = {
  imageUrl: string;
  title: string;
  onClickLink: string;
  children: ReactNode;
  onClick: () => void;
};

const ImageCard = ({
  imageUrl,
  onClickLink,
  title,
  children,
  onClick,
}: ImageCardTypes) => {
  return (
    <Card sx={{ maxWidth: 345 }} onClick={onClick}>
      <Link href={onClickLink}>
        {/*<CardActionArea component={Link} >*/}
        {imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt="green iguana"
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {children}
          </Typography>
        </CardContent>
        {/*</CardActionArea>*/}
      </Link>
    </Card>
  );
};
export { ImageCard };
