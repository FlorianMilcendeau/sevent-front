import { ReactElement } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

interface ActionAreaCardProps {
  title: string;
  description: string;
  imgSrc?: string;
}

export default function ActionAreaCard({ title, description, imgSrc }: ActionAreaCardProps): ReactElement {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        {imgSrc && <CardMedia component="img" height="140" image={imgSrc} alt={title} />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
