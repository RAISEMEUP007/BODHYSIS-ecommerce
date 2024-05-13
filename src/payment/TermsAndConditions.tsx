import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, List, Link } from '@mui/material';

import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { getDocumentsData } from '../api/Store';
import { API_URL } from '../common/AppConstants';

interface props {
  sx?: object;
}

const TermsAndconditions: React.FC<props> = ({ sx }) => {

  const { storeDetails } = useStoreDetails();
  const [document, setDocument] = useState<any>({});

  useEffect(()=>{
    if(storeDetails.document_id){
      getDocumentsData(storeDetails.document_id, (jsonRes:any, status:any)=>{
        if(status == 200) setDocument(jsonRes);
        else setDocument({});
      })
    }else{
      setDocument({});
    }
  }, [storeDetails.document_id]);

  return (
    <Box sx={{ padding:'40px', ...sx }}>
      {storeDetails.is_document ? (
        <>
          {document.document_type == 1? (
            <embed
              style={{ width: '100%' }}
              src={API_URL + document.document_file}
              type="application/pdf"
              width="300"
              height="500"
            />
          ) : (
            <div
              style={{ padding: 8 }}
              dangerouslySetInnerHTML={{ __html: document.document_content }}
            ></div>
          )}
        </>
      ) : (
        <div
            style={{ padding: 8 }}
            dangerouslySetInnerHTML={{ __html: storeDetails.store_wavier }}
          ></div>
      )}
    </Box>
  );
}

export default TermsAndconditions;
