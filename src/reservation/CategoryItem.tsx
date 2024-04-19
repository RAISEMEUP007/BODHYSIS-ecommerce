import React from 'react';
import { useState } from 'react';
import { Typography, Button, ButtonProps } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

type Props = {
  category: any;
}

const CategoryItem: React.FC<Props & ButtonProps> = ({ category, ...rest }) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const { matches900 } = useResponsiveValues();

  return (
    <Button
      style={{ textTransform: 'none' }}
      {...rest}
    >
      <img 
        src={API_URL + category.img_url} 
        alt={category.category}
        style={{ width: '90%', display: imageLoadError ? 'none' : 'block' }}
        onError={() => { setImageLoadError(true) }}
        onLoad={() => { setImageLoadError(false) }}
      />
      {imageLoadError && <FontAwesomeIcon icon={faImage} style={{ width: '100px', height: '100px', color: "#333" }} />}
      <Typography style={{ color: '#000', fontWeight: 'bold', marginTop: '16px', fontSize: matches900?'18px':'16px' }}>{category.category}</Typography>
    </Button>
  )
}

export default CategoryItem;
