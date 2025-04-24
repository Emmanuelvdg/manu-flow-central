
import { useQuoteState } from './useQuoteState';
import { useQuoteActions } from './useQuoteActions';
import type { RFQProductItem } from '../types/quoteTypes';

export interface UseQuoteFormProps {
  initialData?: any;
  id?: string;
  rfqData?: any;
  rfqIdForShipment?: string;
}

export const useQuoteForm = ({ initialData, id, rfqData, rfqIdForShipment }: UseQuoteFormProps) => {
  const isNew = !id || id === "create";
  const [formState, setters] = useQuoteState({ 
    initialData, 
    rfqData, 
    isNew 
  });

  const { handleSave, handleSubmitQuote } = useQuoteActions({ 
    id, 
    formState,
    setIsSubmitting: setters.setStatus,
    setStatus: setters.setStatus
  });

  return {
    formState,
    setters,
    handleSave,
    handleSubmitQuote
  };
};
