import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StoreDetailsProvider } from './StoreDetailsProvider/StoreDetailsProvider';
import { CustomerReservationProvider } from './CustomerReservationProvider/CustomerReservationProvider';

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <StoreDetailsProvider>
      <CustomerReservationProvider>
        {children}
      </CustomerReservationProvider>
    </StoreDetailsProvider>
  </LocalizationProvider>
);

export default Providers;

