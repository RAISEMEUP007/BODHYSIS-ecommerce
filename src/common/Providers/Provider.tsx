import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StoreDetailsProvider } from './StoreDetailsProvider';

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <StoreDetailsProvider>
      {children}
    </StoreDetailsProvider>
  </LocalizationProvider>
);

export default Providers;

