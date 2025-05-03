import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


export default function BasicRating() {
    const [value, setValue] = React.useState<number | null>(2);

    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <Typography component="legend">Over all</Typography>
            <Rating
                name="half-rating" defaultValue={2.5} precision={0.5}
                value={value}
                getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                icon={<FavoriteIcon sx={{ color: 'blueviolet '}} fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={(_event, newValue) => {
                    setValue(newValue);
                }}
            />
            <Typography component="legend">Music</Typography>
            <Rating name="half-rating" value={value} />
            <Typography component="legend">Actors</Typography>
            <Rating name="half-rating" value={value} />



        </Box>
    );
}
