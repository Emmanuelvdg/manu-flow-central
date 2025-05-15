
import { useQuoteState } from './useQuoteState';
import { useQuoteActions } from './useQuoteActions';
import type { RFQProductItem } from '../types/quoteTypes';

export interface UseQuoteFormProps {
  initialData?: any;
  id?: string;
  rfqData?: any;
  rfqIdForShipment?: string;
  isNew?: boolean;
}

export const useQuoteForm = ({ initialData, id, rfqData, rfqIdForShipment, isNew }: UseQuoteFormProps) => {
  // If isNew was not explicitly passed, determine it from the id
  const isNewQuote = isNew !== undefined ? isNew : (!id || id === "create");
  
  const [formState, setters] = useQuoteState({ 
    initialData, 
    rfqData, 
    isNew: isNewQuote
  });

  const { handleSave, handleSubmitQuote } = useQuoteActions({ 
    id, 
    formState,
    setIsSubmitting: setters.setIsSubmitting,
    setStatus: setters.setStatus
  });

  return {
    formState,
    setters,
    handleSave,
    handleSubmitQuote
  };
};
