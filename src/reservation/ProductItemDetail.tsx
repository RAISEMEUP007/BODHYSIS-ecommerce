import React, { useEffect } from 'react';
import { useState } from 'react';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Typography, Button, TextField } from '@mui/material';

import CustomInput from '../common/CustomInput';
import { API_URL } from '../common/AppConstants';
import iconPlaceholder from '../img/icons-placeholder.png';

interface ProductItemDetailProps {
  open: boolean;
  product: any;
  extras: any;
  handleDetailDialogOK: Function,
  handleDetailDialogClose: Function,
}

const ProductItemDetail: React.FC<ProductItemDetailProps> = ({ open, product, extras, handleDetailDialogOK, handleDetailDialogClose }) => {
  // const { line, family: { display_name, img_url }, size, description } = product;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<Array<any>>([]);
  const [specInstructions, setSpecInstructions] = useState("");

  useEffect(() => {
    setQuantity(1);
    setSelectedExtras([]);
    setSpecInstructions("");
  }, [open])

  const handleQuantityChange = (e: any) => {
    if(isNaN(parseInt(e.target.value))){
      setQuantity(0)
    }else setQuantity(parseFloat(e.target.value))
  }

  const handleSpecInstructionsChange = (e: any) => {
    setSpecInstructions(e.target.value)
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{ style: { width: 1000 } }}
    >
      <DialogContent>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={styles.title}>Premium Mid Crossbar</Typography>
            <Typography sx={styles.title}>$45</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', pt: '30px', pb: '30px', borderBottom: '2px solid #ABABAB'  }}>
              <Box sx={{ width: '300px'}}>
                <img src={product && product.img_url? API_URL + product.img_url : iconPlaceholder} alt="product_image" style={{ maxWidth: '100%', width: '100%' }} />
              </Box>
              <Box sx={{ flex: 1, }}>
                <Box sx={{}}>
                  <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{product?.line ?? ''}</h2>
                  <div>{product?.family?.display_name ?? ''}</div>
                  <div>{product?.size ?? ''}</div>
                  {/* <div>25 fit rides 53 to 52</div> */}
                  <div style={{ marginTop: '20px' }}>{product?.description ?? ''}</div>
                  {/* <div>baskets needed</div>
                  <div style={{ marginTop: '20px' }}>Medium rider weight 250lb</div> */}
                </Box>
              </Box>
              <CustomInput sx={{ width: '80px' }} label="Quantity" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} type="number" min={1}/>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ mt: 3, fontWeight: '700' }}>Extras</Typography>
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap' }}>
                {extras && extras.map((extra: any, index:number) => {
                  return (
                    <Box 
                      style={{ padding: '5px' }} 
                      key={index}
                      onClick={() => {
                        if (selectedExtras.includes(extra)) {
                          const updatedSelectedExtras = selectedExtras.filter((item: any) => item.id !== extra.id)
                          setSelectedExtras(updatedSelectedExtras);
                        } else {
                          const updatedSelectedExtras = [...selectedExtras, extra];
                          setSelectedExtras(updatedSelectedExtras)
                        }
                      }}
                    >
                      <img
                        src={API_URL + extra?.img_url ?? ''}
                        alt="extra_img"
                        style={selectedExtras.includes(extra) ? styles.selectedExtraImg : styles.extraImg}
                        key={extra?.id ?? ''}
                        id={extra?.id ?? ''}
                      />
                    </Box>)
                })}
              </Box>
              <Typography sx={{ mt: 3 }}>Special Instructions</Typography>
              <TextField
                id="outlined-multiline-flexible"
                multiline
                rows={4}
                sx={{ width: '100%' }}
                value={specInstructions}
                onChange={handleSpecInstructionsChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button 
              variant="contained" 
              sx={styles.button} 
              onClick={() => {                 
                handleDetailDialogOK({
                  family_id: product.id,
                  quantity: quantity, 
                  price_group_id: product?.lines[0]?.price_group_id ?? 0, 
                  extras: selectedExtras,
                  special_instructions: specInstructions, 
                  img_url: product?.img_url ?? ''}) 
              }}>
              Reserve
            </Button>
            <Button variant="text" sx={styles.button} onClick={() => {handleDetailDialogClose()}}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

const styles = {
  button: {
    pr: 5,
    pl: 5,
    ml: 3
  },
  title: {
    fontWeight: '900', 
    fontSize: '24px'
  },
  extraImg: {
    width: '150px',
    border: '1px solid white'
  },
  selectedExtraImg: {
    width: '150px',
    border: '1px solid #007bff'
  }
}

export default ProductItemDetail;
